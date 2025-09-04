import { exec, ExecOptions } from 'child_process';
import { platform } from 'os';
import { promisify } from 'util';
import * as path from 'path';

// Promisifies the callback-based `exec` function to use it with async/await.
// This simplifies asynchronous code and makes it more readable.
const execPromise = promisify(exec);

/**
 * Defines the options that can be passed to the conversion function.
 * We use a TypeScript interface to ensure type safety.
 */
export interface ConvertOptions {
  outputDir?: string;
  timeout?: number;
}

/**
 * Defines the structure of the object returned by the conversion function.
 * This provides a consistent way to handle success and error states.
 */
export interface ConversionResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

/**
 * Converts a document to a PDF file using LibreOffice.
 * @param inputPath The path to the input document file.
 * @param options Conversion options.
 * @returns A promise that resolves to a ConversionResult.
 */
export async function convertToPDF(inputPath: string, options: ConvertOptions = {}): Promise<ConversionResult> {
  const { outputDir, timeout } = options;
  const fileExtension = path.extname(inputPath).toLowerCase();

  const supportedFormats = ['.docx', '.pptx'];
  if (!supportedFormats.includes(fileExtension)) {
    return {
      success: false,
      error: `Unsupported file format: ${fileExtension}`,
    };
  }

  // Determines the correct LibreOffice command based on the operating system.
  // This is necessary for cross-platform compatibility.
  let libreOfficeCommand: string;
  switch (platform()) {
    case 'win32':
      libreOfficeCommand = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`;
      break;
    case 'darwin':
      libreOfficeCommand = `/Applications/LibreOffice.app/Contents/MacOS/soffice`;
      break;
    default:
      libreOfficeCommand = 'libreoffice';
      break;
  }

  // Constructs the command to be executed.
  const command = `${libreOfficeCommand} --headless --convert-to pdf ${inputPath} ${outputDir ? `--outdir "${outputDir}"` : ''}`;

  try {
    await execPromise(command, { timeout });
    const outputPath = path.join(outputDir || path.dirname(inputPath), `${path.basename(inputPath, fileExtension)}.pdf`);
    return { success: true, outputPath };
  } catch (err: any) {
    // Catches any errors from the `exec` command and returns a structured result.
    return {
      success: false,
      error: err.message || 'An unknown conversion error occurred.',
    };
  }
}

/**
 * Checks if LibreOffice is installed and available by running a version command.
 * @returns A promise that resolves to a boolean.
 */
export async function isLibreOfficeAvailable(): Promise<boolean> {
  const command = `libreoffice --version`;
  try {
    const { stdout } = await execPromise(command);
    // Checks for "LibreOffice" in the output to confirm availability.
    return stdout.includes('LibreOffice');
  } catch (err) {
    // If the command fails, it means LibreOffice is not available.
    return false;
  }
}
