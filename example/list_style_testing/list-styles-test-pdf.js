/* eslint-disable no-console, no-underscore-dangle, import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateListStylesTestPdf() {
  // Read the HTML test file
  const htmlContent = fs.readFileSync(path.join(__dirname, 'list-styles-test.html'), 'utf-8');

  console.log('Generating PDF with list styles test...');

  try {
    // Launch browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set content and wait for it to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    await browser.close();

    // Write the PDF file
    const outputPath = path.join(__dirname, 'list-styles-test.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`PDF file generated successfully: ${outputPath}`);
    console.log('Check the generated PDF file to verify list styles are preserved.');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

// Run the test
generateListStylesTestPdf();
