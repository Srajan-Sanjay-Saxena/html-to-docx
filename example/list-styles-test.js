/* eslint-disable no-console, no-underscore-dangle */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import HTMLtoDOCX from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateListStylesTestDocx() {
  // Read the HTML test file
  const htmlContent = fs.readFileSync(path.join(__dirname, 'list-styles-test.html'), 'utf-8');

  console.log('Generating DOCX with list styles test...');

  try {
    // Document options
    const documentOptions = {
      orientation: 'portrait',
      margins: {
        top: 720,
        right: 720,
        bottom: 720,
        left: 720,
        header: 720,
        footer: 720,
        gutter: 0,
      },
      title: 'List Styles Test',
      subject: 'Testing UL/OL styles inheritance',
      creator: 'html-to-docx',
      keywords: ['list', 'styles', 'ul', 'ol'],
      description: 'Test document for list styles inheritance',
      lastModifiedBy: 'html-to-docx',
      revision: 1,
      createdAt: new Date(),
      modifiedAt: new Date(),
      headerType: 'default',
      header: false,
      footerType: 'default',
      footer: false,
      font: 'Times New Roman',
      fontSize: 22,
      complexScriptFontSize: 22,
      table: {
        row: {
          cantSplit: false,
        },
        borderOptions: {
          size: 1,
          color: '000000',
          stroke: 'single',
        },
        addSpacingAfter: true,
      },
      pageSize: {
        width: 11906,
        height: 16838,
      },
    };

    // Convert HTML to DOCX
    const buffer = await HTMLtoDOCX(htmlContent, null, documentOptions);

    // Write the DOCX file
    const outputPath = path.join(__dirname, 'list-styles-test.docx');
    fs.writeFileSync(outputPath, buffer);

    console.log(`DOCX file generated successfully: ${outputPath}`);
    console.log(
      'This test demonstrates that styles applied to UL/OL elements are now properly inherited by list items.'
    );
    console.log('Check the generated DOCX file to verify:');
    console.log('1. Unordered lists have Verdana font, blue color, etc.');
    console.log('2. Nested lists inherit and override styles correctly');
    console.log('3. Ordered lists have proper text alignment and font styles');
    console.log('4. Background colors are applied to lists');
    console.log('5. Line heights are properly set');
  } catch (error) {
    console.error('Error generating DOCX:', error);
  }
}

// Run the test
generateListStylesTestDocx();
