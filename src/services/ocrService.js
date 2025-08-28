const { Storage } = require('@google-cloud/storage');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

// Initialize Firebase Admin SDK
// Make sure to set the GOOGLE_APPLICATION_CREDENTIALS environment variable
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET // e.g., 'your-project-id.appspot.com'
});

const storage = admin.storage();
const bucket = storage.bucket();

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = process.env.GOOGLE_LOCATION; // Format is 'us' or 'eu'
const processorId = process.env.GOOGLE_PROCESSOR_ID; // Create processor in Cloud Console

const client = new DocumentProcessorServiceClient();

/**
 * Uploads a file to Firebase Storage and returns the public URL.
 * @param {string} filePath - The local path to the file.
 * @param {string} originalname - The original name of the file.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
async function uploadToFirebase(filePath, originalname) {
  const destination = `receipts/${uuidv4()}-${originalname}`;
  await bucket.upload(filePath, {
    destination: destination,
    public: true
  });
  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}

/**
 * Extracts text from a file using Google Cloud Document AI API.
 * @param {string} filePath - The local path to the file.
 * @param {string} mimeType - The mime type of the file.
 * @returns {Promise<object>} - An object containing the extracted text and structured data.
 */
async function performOcr(filePath, mimeType) {
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

    // Read the file into memory.
    const imageFile = await fs.readFile(filePath);

    // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = Buffer.from(imageFile).toString('base64');

    const request = {
        name,
        rawDocument: {
            content: encodedImage,
            mimeType,
        },
    };

    // Recognizes text entities in the PDF document
    const [result] = await client.processDocument(request);
    const { document } = result;
    const { text, entities } = document;

    const extractedData = {
        vendor: null,
        date: null,
        amount: null,
        rawText: text
    };

    for (const entity of entities) {
        switch (entity.type) {
            case 'supplier_name':
                extractedData.vendor = entity.mentionText;
                break;
            case 'receipt_date':
                extractedData.date = entity.normalizedValue.text;
                break;
            case 'total_amount':
                extractedData.amount = parseFloat(entity.normalizedValue.text);
                break;
        }
    }

  // Fallback to regex if structured data is not available
  if (!extractedData.amount) {
    const amountMatch = text.match(/(?:Total|Amount|Grand Total|Net Amount|₹|Rs\.?|INR|\$)\s*[:\-]?\s*([\d,]+(\.\d{1,2})?)/i);
    if (amountMatch) {
      extractedData.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }
  }

  if (!extractedData.date) {
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/);
    if (dateMatch) {
      extractedData.date = new Date(dateMatch[1].replace(/\//g, '-'));
    }
  }

  if (!extractedData.vendor) {
      // Simple vendor extraction from the first few lines
      const lines = text.split('\n');
      if(lines.length > 0) {
          extractedData.vendor = lines[0].trim();
      }
  }


  return extractedData;
}


/**
 * Processes a receipt file: uploads to storage and performs OCR.
 * @param {object} file - The file object from multer.
 * @returns {Promise<object>} - The extracted expense data.
 */
async function processReceipt(file) {
  const fileUrl = await uploadToFirebase(file.path, file.originalname);
  const ocrData = await performOcr(file.path, file.mimetype);

  return {
    ...ocrData,
    fileUrl: fileUrl
  };
}

module.exports = {
  processReceipt
};
