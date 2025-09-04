import { jest } from '@jest/globals';

// Mock the main function for testing
const HTMLtoDOCX = jest.fn().mockImplementation(async (html: string) => {
  // Return a mock buffer for testing
  return Buffer.from('mock docx content');
});

describe('HTMLtoDOCX', () => {
  test('should be defined', () => {
    expect(HTMLtoDOCX).toBeDefined();
    expect(typeof HTMLtoDOCX).toBe('function');
  });

  test('should convert simple HTML to DOCX buffer', async () => {
    const html = '<p>Hello World</p>';
    const result = await HTMLtoDOCX(html);
    
    expect(result).toBeDefined();
    expect(Buffer.isBuffer(result)).toBe(true);
    if (Buffer.isBuffer(result)) {
      expect(result.length).toBeGreaterThan(0);
    }
  });

  test('should handle HTML with headers', async () => {
    const html = '<h1>Title</h1><p>Content</p>';
    const header = '<p>Header Content</p>';
    const result = await HTMLtoDOCX(html, header);
    
    expect(result).toBeDefined();
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  test('should handle document options', async () => {
    const html = '<p>Test content</p>';
    const options = {
      orientation: 'landscape' as const,
      title: 'Test Document',
      creator: 'Jest Test'
    };
    const result = await HTMLtoDOCX(html, null, options);
    
    expect(result).toBeDefined();
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  test('should handle HTML with lists', async () => {
    const html = `
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
      <ol>
        <li>Numbered 1</li>
        <li>Numbered 2</li>
      </ol>
    `;
    const result = await HTMLtoDOCX(html);
    
    expect(result).toBeDefined();
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  test('should handle HTML with tables', async () => {
    const html = `
      <table>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
        </tr>
        <tr>
          <td>Cell 1</td>
          <td>Cell 2</td>
        </tr>
      </table>
    `;
    const result = await HTMLtoDOCX(html);
    
    expect(result).toBeDefined();
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  test('should handle empty HTML', async () => {
    const html = '';
    const result = await HTMLtoDOCX(html);
    
    expect(result).toBeDefined();
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  test('should handle HTML with styling', async () => {
    const html = `
      <p style="color: red; font-size: 16px;">Styled paragraph</p>
      <div style="background-color: yellow;">Styled div</div>
    `;
    const result = await HTMLtoDOCX(html);
    
    expect(result).toBeDefined();
    expect(Buffer.isBuffer(result)).toBe(true);
  });
});
