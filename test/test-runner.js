#!/usr/bin/env node

/**
 * Comprehensive test runner for html-to-docx project
 * Runs all tests and provides detailed output
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const testSuites = [
  {
    name: 'HTML to DOCX Core Tests',
    command: 'npm',
    args: ['run', 'test:html-to-docx'],
    description: 'Tests core HTML to DOCX conversion functionality'
  },
  {
    name: 'PDF Creator Tests',
    command: 'npm',
    args: ['run', 'test:pdf'],
    description: 'Tests PDF conversion functionality'
  },
  {
    name: 'Utility Tests',
    command: 'npm',
    args: ['run', 'test:unit'],
    description: 'Tests utility functions and helpers'
  },
  {
    name: 'All Tests with Coverage',
    command: 'npm',
    args: ['run', 'test:coverage'],
    description: 'Runs all tests with coverage report'
  }
];

async function runTest(suite) {
  return new Promise((resolve, reject) => {
    console.log(`\n🧪 Running: ${suite.name}`);
    console.log(`📝 ${suite.description}\n`);

    const child = spawn(suite.command, suite.args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${suite.name} - PASSED\n`);
        resolve();
      } else {
        console.log(`❌ ${suite.name} - FAILED (exit code: ${code})\n`);
        reject(new Error(`Test suite failed: ${suite.name}`));
      }
    });

    child.on('error', (error) => {
      console.error(`❌ Error running ${suite.name}:`, error);
      reject(error);
    });
  });
}

async function runAllTests() {
  console.log('🚀 Starting HTML-to-DOCX Test Suite');
  console.log('=====================================\n');

  let passed = 0;
  let failed = 0;

  for (const suite of testSuites) {
    try {
      await runTest(suite);
      passed++;
    } catch (error) {
      failed++;
      console.error(`Failed to run ${suite.name}:`, error.message);
    }
  }

  console.log('\n📊 Test Summary');
  console.log('================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);

  if (failed > 0) {
    console.log('\n❌ Some tests failed. Please check the output above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All test suites passed successfully!');
    process.exit(0);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch((error) => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}