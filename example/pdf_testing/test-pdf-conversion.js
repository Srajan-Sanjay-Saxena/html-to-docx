import { existsSync } from 'fs';
import { convertToPDF, isLibreOfficeAvailable } from './pdfCreator.js';

async function testPDFConversion() {
  try {
    // Check if LibreOffice is available
    const isAvailable = await isLibreOfficeAvailable();
    console.log('LibreOffice available:', isAvailable);

    if (!isAvailable) {
      console.log('LibreOffice is not available. Please install it to test the conversion.');
      return;
    }

    // Test with a sample DOCX file (if it exists)
    const sampleDocx = './example/sample.docx';
    if (existsSync(sampleDocx)) {
      console.log('Converting DOCX to PDF...');
      const pdfPath = await convertToPDF(sampleDocx);
      console.log('PDF created at:', pdfPath);
    } else {
      console.log('Sample DOCX file not found. Skipping DOCX conversion test.');
    }

    // Test with a sample PPTX file (if it exists)
    const samplePptx = './example/sample.pptx';
    if (existsSync(samplePptx)) {
      console.log('Converting PPTX to PDF...');
      const pdfPath = await convertToPDF(samplePptx);
      console.log('PDF created at:', pdfPath);
    } else {
      console.log('Sample PPTX file not found. Skipping PPTX conversion test.');
    }
  } catch (error) {
    console.error('Error during PDF conversion test:', error.message);
  }
}

testPDFConversion();
