const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3001;

// OCR endpoint
app.post('/ocr', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  try {
    const imagePath = path.resolve(req.file.path);
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    // Clean up uploaded file
    fs.unlinkSync(imagePath);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: 'OCR failed', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('AI OCR Service is running');
});

app.listen(PORT, () => {
  console.log(`AI OCR service listening on port ${PORT}`);
});
