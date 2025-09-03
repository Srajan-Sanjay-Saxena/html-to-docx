/* eslint-disable no-console, no-underscore-dangle */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import HTMLtoDOCX from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testEdgeCases() {
  const htmlContent = fs.readFileSync(path.join(__dirname, 'list-edge-cases-test.html'), 'utf-8');

  console.log('Testing list style inheritance edge cases...');

  try {
    const documentOptions = {
      orientation: 'portrait',
      margins: { top: 720, right: 720, bottom: 720, left: 720 },
      title: 'List Edge Cases Test',
    };

    const buffer = await HTMLtoDOCX(htmlContent, null, documentOptions);
    const outputPath = path.join(__dirname, 'list-edge-cases-test.docx');
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Edge cases test completed: ${outputPath}`);
    console.log('\nManual verification needed:');
    console.log('1. Check if child styles override parent styles correctly');
    console.log('2. Verify triple-nested lists maintain proper inheritance');
    console.log('3. Ensure complex style combinations work as expected');
    console.log('4. Confirm no crashes with empty lists or edge cases');
    console.log('5. Validate mixed content preserves individual element styles');
  } catch (error) {
    console.error('❌ Error in edge cases test:', error);
  }
}

testEdgeCases();
