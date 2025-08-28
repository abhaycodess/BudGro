const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Expense = require('../../../expense/src/models/Expense');
const { processReceipt } = require('../services/ocrService');

const router = express.Router();
// Multer setup
const upload = multer({ dest: 'uploads/' });

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
    // Process receipt
    const { vendor, amount, date, fileUrl, rawText } = await processReceipt(req.file);

    // Clean up file
    fs.unlinkSync(filePath);

    if (!amount) return res.status(422).json({ error: 'Could not extract amount from bill' });

    // Save to DB
    const expense = new Expense({
        userId,
        amount,
        date,
        vendor,
        fileUrl,
        rawText,
        category: 'Bill Upload',
        description: `Receipt from ${vendor}`,
    });
    await expense.save();
    return res.json({ message: 'Expense created from bill', expense });
  } catch (err) {
    console.error('Bill upload error:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ error: 'Failed to process bill' });
  }
});

module.exports = router;
