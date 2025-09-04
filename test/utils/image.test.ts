import { guessMimeTypeFromBase64, getMimeType } from '../../src/utils/image';

describe('Image Utils', () => {
  describe('guessMimeTypeFromBase64', () => {
    test('should detect JPEG format', () => {
      // JPEG magic number: FF D8 FF
      const jpegBase64 = btoa('\xFF\xD8\xFF');
      expect(guessMimeTypeFromBase64(jpegBase64)).toBe('image/jpeg');
    });

    test('should detect PNG format', () => {
      // PNG magic number: 89 50 4E 47
      const pngBase64 = btoa('\x89PNG');
      expect(guessMimeTypeFromBase64(pngBase64)).toBe('image/png');
    });

    test('should detect GIF format', () => {
      // GIF magic number: 47 49 46
      const gifBase64 = btoa('GIF');
      expect(guessMimeTypeFromBase64(gifBase64)).toBe('image/gif');
    });

    test('should detect BMP format', () => {
      // BMP magic number: 42 4D
      const bmpBase64 = btoa('BM');
      expect(guessMimeTypeFromBase64(bmpBase64)).toBe('image/bmp');
    });

    test('should return false for unknown format', () => {
      const unknownBase64 = btoa('UNKNOWN');
      expect(guessMimeTypeFromBase64(unknownBase64)).toBe(false);
    });

    test('should handle empty string', () => {
      expect(guessMimeTypeFromBase64('')).toBe(false);
    });
  });

  describe('getMimeType', () => {
    test('should return mime type for known extensions', () => {
      expect(getMimeType('image.jpg', '')).toBe('image/jpeg');
      expect(getMimeType('image.png', '')).toBe('image/png');
      expect(getMimeType('image.gif', '')).toBe('image/gif');
    });

    test('should fallback to base64 detection when extension lookup fails', () => {
      const jpegBase64 = btoa('\xFF\xD8\xFF');
      expect(getMimeType('unknown', jpegBase64)).toBe('image/jpeg');
    });

    test('should handle file paths with extensions', () => {
      expect(getMimeType('/path/to/image.jpeg', '')).toBe('image/jpeg');
      expect(getMimeType('C:\\\\images\\\\photo.png', '')).toBe('image/png');
    });

    test('should return false when both methods fail', () => {
      const unknownBase64 = btoa('UNKNOWN');
      expect(getMimeType('unknown', unknownBase64)).toBe(false);
    });
  });
});