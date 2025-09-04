# Testing Setup for html-to-docx

## Overview
This document outlines the comprehensive testing setup for the html-to-docx project, including unit tests, PDF conversion tests, and test file management.

## Test Structure

```
test/
├── doc/
│   └── sample.docx          # Test DOCX file for PDF conversion
├── pptx/
│   └── sample.pptx          # Test PPTX file for PDF conversion  
├── pdf/                     # Output directory for PDF tests
├── error_file/
│   └── test.txt            # Test file for unsupported formats
└── utils/
    ├── html-to-docx.test.ts    # Core HTML to DOCX tests
    ├── pdf-creator.test.ts     # PDF conversion tests
    ├── image.test.ts           # Image utility tests
    ├── url.test.ts             # URL utility tests
    └── truthy-check.test.ts    # Utility function tests
```

## Available Test Scripts

### Individual Test Suites
- `npm run test` - Run all tests
- `npm run test:all` - Run all tests with verbose output
- `npm run test:html-to-docx` - Test core HTML to DOCX functionality
- `npm run test:pdf` - Test PDF conversion functionality
- `npm run test:unit` - Test utility functions
- `npm run test:coverage` - Run tests with coverage report

### Test Runner
- `npm run test:runner` - Comprehensive test runner with detailed output

### Watch Mode
- `npm run test:watch` - Run tests in watch mode for development

## Test Files

### Sample Documents
The test suite includes pre-generated sample files:

1. **sample.docx** - Contains:
   - Headers and paragraphs
   - Lists (ordered and unordered)
   - Tables with borders
   - Various text formatting

2. **sample.pptx** - Contains:
   - Multiple slide content
   - Presentation structure
   - Text and formatting elements

### PDF Conversion Tests
The PDF creator tests use actual file paths and test:
- DOCX to PDF conversion
- PPTX to PDF conversion
- Error handling for unsupported formats
- Custom output directories
- Timeout handling
- LibreOffice availability checking

## Configuration

### Jest Configuration
- ES Module support with `ts-jest`
- TypeScript compilation
- Module name mapping for `.js` extensions
- Coverage thresholds set to 70%
- Proper handling of Node.js built-ins

### TypeScript Support
- Full TypeScript support for test files
- Proper type checking and compilation
- ES2020 target with ESNext modules

## Running Tests

### Quick Start
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm run test:pdf

# Use the comprehensive test runner
npm run test:runner
```

### Development Workflow
```bash
# Watch mode for active development
npm run test:watch

# Run specific test file
npx jest test/utils/pdf-creator.test.ts

# Run tests with verbose output
npm run test:all
```

## Test Coverage

The test suite covers:
- ✅ HTML to DOCX conversion (mocked for unit testing)
- ✅ PDF conversion functionality (with LibreOffice)
- ✅ Error handling and edge cases
- ✅ File format validation
- ✅ Cross-platform compatibility
- ✅ Utility functions

## Notes

- PDF conversion tests use mocked `exec` calls to avoid requiring LibreOffice installation
- Sample files are generated using the html-to-docx library itself
- Tests are designed to run in CI/CD environments without external dependencies
- All tests use proper TypeScript typing for better maintainability

## Troubleshooting

### Common Issues
1. **Module resolution errors**: Ensure Jest configuration matches your ES module setup
2. **TypeScript compilation errors**: Check `tsconfig.json` and Jest transform settings
3. **Import/export issues**: Verify module name mapping in Jest config

### Debug Mode
```bash
# Run Jest with debug output
npx jest --verbose --no-cache test/utils/pdf-creator.test.ts
```