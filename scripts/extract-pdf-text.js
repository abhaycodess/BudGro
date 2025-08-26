// This script extracts text from a PDF file using pdf-parse and writes it to a .txt file for About Us page use.
// Usage: node extract-pdf-text.js <input-pdf-path> <output-txt-path>

const fs = require('fs');
const pdf = require('pdf-parse');

if (process.argv.length < 4) {
  console.error('Usage: node extract-pdf-text.js <input-pdf-path> <output-txt-path>');
  process.exit(1);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];

const dataBuffer = fs.readFileSync(inputPath);

pdf(dataBuffer).then(function(data) {
  fs.writeFileSync(outputPath, data.text, 'utf8');
  console.log('PDF text extracted to', outputPath);
});
