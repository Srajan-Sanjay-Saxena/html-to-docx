import { exec } from 'child_process';
import { promisify } from 'util';
import { platform } from 'os';
import { extname } from 'path';

const execPromise = promisify(exec);

/**
 * Detects the operating system and returns the appropriate LibreOffice command
 * @returns {string} The LibreOffice command for the current OS
 */
function getLibreOfficeCommand() {
  const osPlatform = platform();

  switch (osPlatform) {
    case 'win32':
      // Windows paths for LibreOffice
      return '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';
    case 'darwin':
      // macOS path for LibreOffice
      return '/Applications/LibreOffice.app/Contents/MacOS/soffice';
    default:
      // Linux and other Unix-like systems
      return 'libreoffice';
  }
}

/**
 * Converts DOCX or PPTX files to PDF using LibreOffice
 * @param {string} inputFilePath - Path to the input file (DOCX or PPTX)
 * @param {string} outputDir - Directory where the PDF should be saved (optional)
 * @returns {Promise<string>} Path to the generated PDF file
 */
export async function convertToPDF(inputFilePath, outputDir = null) {
  try {
    // Check file extension
    const extension = extname(inputFilePath).toLowerCase();

    if (extension !== '.docx' && extension !== '.pptx') {
      throw new Error('Unsupported file format. Only DOCX and PPTX files are supported.');
    }

    // Get the appropriate LibreOffice command for the OS
    const libreOfficeCmd = getLibreOfficeCommand();

    // Build the command
    let command = `${libreOfficeCmd} --headless --convert-to pdf`;

    // Add output directory if specified
    if (outputDir) {
      command += ` --outdir "${outputDir}"`;
    }

    // Add input file path
    command += ` "${inputFilePath}"`;

    // Execute the command
    const { stderr } = await execPromise(command);

    if (stderr) {
      console.warn('LibreOffice warning:', stderr);
    }

    // Generate the expected output file path
    const outputFile = inputFilePath.replace(/\.(docx|pptx)$/i, '.pdf');

    return outputFile;
  } catch (error) {
    throw new Error(`Failed to convert file to PDF: ${error.message}`);
  }
}

/**
 * Checks if LibreOffice is installed and accessible
 * @returns {Promise<boolean>} True if LibreOffice is available, false otherwise
 */
export async function isLibreOfficeAvailable() {
  try {
    const libreOfficeCmd = getLibreOfficeCommand();
    const command = `${libreOfficeCmd} --version`;
    const { stdout } = await execPromise(command);
    return stdout.includes('LibreOffice');
  } catch (error) {
    return false;
  }
}

export default {
  convertToPDF,
  isLibreOfficeAvailable,
};
