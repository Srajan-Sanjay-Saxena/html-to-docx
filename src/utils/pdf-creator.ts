import { exec, ExecOptions } from 'child_process';
import { platform } from 'os';
import { promisify } from 'util';
import * as path from 'path';

const execPromise = promisify(exec);

export interface ConvertOptions {
  outputDir?: string;
  timeout?: number;
}

export interface ConversionResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

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

  const command = `${libreOfficeCommand} --headless --convert-to pdf ${inputPath} ${outputDir ? `--outdir "${outputDir}"` : ''}`;

  try {
    await execPromise(command, { timeout });
    const outputPath = path.join(outputDir || path.dirname(inputPath), `${path.basename(inputPath, fileExtension)}.pdf`);
    return { success: true, outputPath };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'An unknown conversion error occurred.',
    };
  }
}

export async function isLibreOfficeAvailable(): Promise<boolean> {
  const command = `libreoffice --version`;
  try {
    const { stdout } = await execPromise(command);
    return stdout.includes('LibreOffice');
  } catch (err) {
    return false;
  }
}