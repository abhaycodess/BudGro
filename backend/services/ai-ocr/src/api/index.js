const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Tesseract = require('tesseract.js');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const mongoose = require('mongoose');
const Expense = require('../../../expense/src/models/Expense');

const router = express.Router();
// Multer setup
const upload = multer({ dest: 'uploads/' });

// Helper: Run OCR (Vision API preferred, fallback to Tesseract)
async function extractTextFromFile(filePath) {
  // Try Google Cloud Vision API
  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const client = new vision.ImageAnnotatorClient();
      const [result] = await client.textDetection(filePath);
      const detections = result.textAnnotations;
      if (detections && detections.length > 0) {
        return detections[0].description;
      }
    }
  } catch (err) {
    // Fallback to Tesseract
  }
  // Fallback: Tesseract.js
  const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
  return text;
}
// Helper: Parse text for fields
function parseExpenseFields(text) {
  // Amount
  let amountMatch = text.match(/(?:Total|Amount|Grand Total|Net Amount|₹|Rs\.?|INR|\$)\s*[:\-]?\s*([\d,]+(\.\d{1,2})?)/i);
  let amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : undefined;
  // Date
  let dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/);
  let date = dateMatch ? new Date(dateMatch[1].replace(/\//g, '-')) : new Date();
  // Category
  let category = 'Uncategorized';
  if (/grocery|supermarket|mart|vegetable|fruit/i.test(text)) category = 'Grocery';
  else if (/travel|flight|train|bus|taxi|uber|ola|cab|transport/i.test(text)) category = 'Travel';
  else if (/electricity|water|gas|utility|bill|mobile|internet|recharge/i.test(text)) category = 'Utilities';
  else if (/food|restaurant|zomato|swiggy|pizza|meal|cafe|snack/i.test(text)) category = 'Food';
  // Vendor/Payee
  let vendorMatch = text.match(/(?:From|Payee|Merchant|Vendor|To|By|Billed To|Sold By|Supplier)\s*[:\-]?\s*([A-Za-z0-9 &.,'-]+)/i);
  let vendor = vendorMatch ? vendorMatch[1].trim() : 'Not specified';
  // Payment method
  let paymentMatch = text.match(/(Credit Card|Debit Card|Cash|UPI|Bank Transfer|Netbanking|Wallet|Paytm|Google Pay|PhonePe)/i);
  let paymentMethod = paymentMatch ? paymentMatch[1] : '';
  return { amount, date, category, vendor, paymentMethod };
}

// Helper: Check for duplicate expense
async function isDuplicateExpense({ userId, amount, date }) {
  if (!userId || !amount || !date) return false;
  const start = new Date(date); start.setHours(0,0,0,0);
  const end = new Date(date); end.setHours(23,59,59,999);
  const existing = await Expense.findOne({ userId, amount, date: { $gte: start, $lte: end } });
  return !!existing;
}

// POST /upload-bill
router.post('/upload-bill', upload.single('file'), async (req, res) => {
  try {
    const userId = req.user && req.user._id;
  if (!userId) return res.status(401).json({ error: 'User not authenticated' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = req.file.path;
  // Only allow images and PDFs
  const ext = path.extname(req.file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.pdf'].includes(ext)) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file type' });
    }
  // OCR extraction
  const text = await extractTextFromFile(filePath);
  // Clean up file
  fs.unlinkSync(filePath);
  // Parse fields
  const { amount, date, category, vendor, paymentMethod } = parseExpenseFields(text);
  if (!amount) return res.status(422).json({ error: 'Could not extract amount from bill' });
  // Deduplication
  const duplicate = await isDuplicateExpense({ userId, amount, date });
  if (duplicate) return res.status(409).json({ error: 'Duplicate expense detected for this bill' });
  // Save to DB
  const expense = new Expense({
  userId,
  amount,
  date,
  category,
  vendor,
  paymentMethod,
      source: 'Bill Upload',
    });
    await expense.save();
    return res.json({ message: 'Expense created from bill', expense });
  } catch (err) {
    console.error('Bill upload error:', err);
    return res.status(500).json({ error: 'Failed to process bill' });
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const XLSX = require('xlsx');
const axios = require('axios');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3001;

// Utility: Smart extraction for food delivery and general bills
function extractFields(text) {
  // Try to find amount, date, description/category, restaurant, item
  let amountMatch = text.match(/(?:Total Amount|Total Paid|Amount Paid|Order Amount|Total|Grand Total|Rs|INR|Paid)[^\d]*(\d+[.,]?\d*)/i);
  if (!amountMatch) {
    // fallback: last number in the text
    const allNums = [...text.matchAll(/(\d+[.,]?\d*)/g)].map(m => m[1]);
    if (allNums.length) amountMatch = [null, allNums[allNums.length - 1]];
  }
  const dateMatch = text.match(/(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/);
  // Try to find restaurant name (Zomato/Swiggy)
  let restaurant = '';
  const restMatch = text.match(/(?:from|restaurant|delivered by|delivered from|outlet)[:\s]*([A-Za-z0-9 &\-]{3,})/i);
  if (restMatch) restaurant = restMatch[1].trim();
  else {
    // fallback: first line with 'Zomato' or 'Swiggy' or 'Pizza'
    const lines = text.split(/\r?\n/);
    for (let l of lines) {
      if (/zomato|swiggy|pizza|restaurant/i.test(l)) { restaurant = l.trim(); break; }
    }
  }
  // Try to find main item
  let item = '';
  const itemMatch = text.match(/(?:Item|Order|Food|Product|Description)[:\s]*([A-Za-z0-9 \-]{3,})/i);
  if (itemMatch) item = itemMatch[1].trim();
  else {
    // fallback: first line with 'Pizza' or food keyword
    const lines = text.split(/\r?\n/);
    for (let l of lines) {
      if (/pizza|burger|sandwich|meal|fries|pasta|roll|wrap|biryani|rice|noodle|cake|dessert|drink|beverage/i.test(l)) { item = l.trim(); break; }
    }
  }
  // Compose description
  let description = item || restaurant || 'Expense';
  if (restaurant && item) description = `${item} from ${restaurant}`;
  // Try to infer category from text
  // Always use 'General' as category regardless of content
  let category = 'General';
  return {
    amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : undefined,
    date: dateMatch ? dateMatch[1] : undefined,
    description,
    category,
    restaurant,
    item
  };
}

// Utility: Extract from spreadsheet (CSV/XLSX)
function extractFromSheet(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  if (json.length > 1) {
    const headers = json[0].map(h => h.toString().toLowerCase());
    const row = json[1];
    const expense = {};
    headers.forEach((h, i) => {
      if (h.includes('amount')) expense.amount = parseFloat(row[i]);
      if (h.includes('desc') || h.includes('purpose') || h.includes('title')) expense.description = row[i];
      if (h.includes('date')) expense.date = row[i];
      if (h.includes('category')) expense.category = row[i];
    });
    expense.category = expense.category || 'Bills';
    return expense;
  }
  return null;
}

// OCR endpoint: Accept image/pdf/csv/excel
app.post('/ocr', upload.single('bill'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const ext = path.extname(req.file.originalname).toLowerCase();
  let extracted = {};
  try {
    if ([".jpg", ".jpeg", ".png", ".bmp", ".gif", ".webp"].includes(ext)) {
      // Image: OCR
      const imagePath = path.resolve(req.file.path);
      const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
      extracted = extractFields(text);
      fs.unlinkSync(imagePath);
    } else if (ext === ".pdf") {
      // PDF: Extract text, then OCR if needed
      const pdfPath = path.resolve(req.file.path);
      const dataBuffer = fs.readFileSync(pdfPath);
      const pdfData = await pdf(dataBuffer);
      let text = pdfData.text;
      if (!text || text.trim().length < 10) {
        // fallback: OCR first page as image (not implemented here)
        text = '';
      }
      extracted = extractFields(text);
      fs.unlinkSync(pdfPath);
    } else if ([".csv", ".xls", ".xlsx"].includes(ext)) {
      // Spreadsheet: Parse and extract
      const buffer = fs.readFileSync(req.file.path);
      extracted = extractFromSheet(buffer);
      fs.unlinkSync(req.file.path);
    } else {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Unsupported file type' });
    }
    // If not enough info, return error
    if (!extracted || !extracted.amount) {
      return res.status(422).json({ error: 'Could not extract expense info', extracted });
    }
    // Auto-add to expense DB for all users if userId is provided
    const userId = req.body.userId;
    if (userId && extracted.amount) {
      // Compose payload for expense service
      const payload = {
        userId,
        amount: extracted.amount,
  category: extracted.category || 'General',
  description: extracted.description || 'Expense',
        date: extracted.date || new Date().toISOString(),
        type: 'expense'
      };
      try {
        await axios.post('http://localhost:3003/expense', payload);
      } catch (err) {
        // Log but don't block response
        console.error('Failed to add expense to DB:', err.message);
      }
    }
    return res.json({ expense: extracted });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ error: 'Extraction failed', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('AI OCR Service is running');
});

app.listen(PORT, () => {
  console.log(`AI OCR service listening on port ${PORT}`);
});
