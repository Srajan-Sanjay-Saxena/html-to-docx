import { jest } from '@jest/globals';
import * as path from 'path';

const TEST_DOCX_PATH = path.join(process.cwd(), 'test', 'doc', 'sample.docx');
const TEST_PPTX_PATH = path.join(process.cwd(), 'test', 'pptx', 'sample.pptx');
const TEST_PDF_DIR = path.join(process.cwd(), 'test', 'pdf');
const TEST_TXT_PATH = path.join(process.cwd(), 'test', 'error_file', 'test.txt');

// Mock the entire child_process module
const mockExecPromise = jest.fn() as jest.MockedFunction<any>;
jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

jest.mock('util', () => ({
  promisify: jest.fn(() => mockExecPromise),
}));

const mockPlatform = jest.fn();
jest.mock('os', () => ({
  platform: mockPlatform,
}));

// Import after mocking
import { convertToPDF, isLibreOfficeAvailable, ConversionResult } from '../../src/utils/pdf-creator';

describe('PDF Creator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockExecPromise as any).mockResolvedValue({ stdout: '', stderr: '' });
    mockPlatform.mockReturnValue('linux');
  });

  describe('convertToPDF', () => {
    it('should convert DOCX file successfully', async () => {
      const result: ConversionResult = await convertToPDF(TEST_DOCX_PATH);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBe(path.join(path.dirname(TEST_DOCX_PATH), 'sample.pdf'));
      expect(result.error).toBeUndefined();
    });

    it('should convert PPTX file successfully', async () => {
      mockPlatform.mockReturnValue('darwin');

      const result: ConversionResult = await convertToPDF(TEST_PPTX_PATH);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBe(path.join(path.dirname(TEST_PPTX_PATH), 'sample.pdf'));
      expect(result.error).toBeUndefined();
    });

    it('should handle unsupported file formats', async () => {
      const result: ConversionResult = await convertToPDF(TEST_TXT_PATH);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported file format');
      expect(result.outputPath).toBeUndefined();
    });

    it('should handle conversion errors', async () => {
      (mockExecPromise as any).mockRejectedValue(new Error('LibreOffice not found'));

      const result: ConversionResult = await convertToPDF(TEST_DOCX_PATH);

      expect(result.success).toBe(false);
      expect(result.error).toContain('LibreOffice not found');
    });

    it('should use custom output directory', async () => {
      mockPlatform.mockReturnValue('win32');

      await convertToPDF(TEST_DOCX_PATH, { outputDir: TEST_PDF_DIR });
      
      expect(mockExecPromise).toHaveBeenCalledWith(
        expect.stringContaining(`--outdir "${TEST_PDF_DIR}"`),
        expect.any(Object)
      );
    });

    it('should handle timeout option', async () => {
      await convertToPDF(TEST_DOCX_PATH, { timeout: 60000 });
      
      expect(mockExecPromise).toHaveBeenCalledWith(
        expect.any(String),
        { timeout: 60000 }
      );
    });
  });

  describe('isLibreOfficeAvailable', () => {
    it('should return true when LibreOffice is available', async () => {
      (mockExecPromise as any).mockResolvedValue({ stdout: 'LibreOffice 7.0.0.0', stderr: '' });

      const result = await isLibreOfficeAvailable();

      expect(result).toBe(true);
    });

    it('should return false when LibreOffice is not available', async () => {
      (mockExecPromise as any).mockRejectedValue(new Error('Command not found'));

      const result = await isLibreOfficeAvailable();
      expect(result).toBe(false);
    });

    it('should return false when output does not contain LibreOffice', async () => {
      (mockExecPromise as any).mockResolvedValue({ stdout: 'Some other software', stderr: '' });

      const result = await isLibreOfficeAvailable();
      expect(result).toBe(false);
    });
  });
});