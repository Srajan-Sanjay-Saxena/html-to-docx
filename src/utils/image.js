import mimeTypes from 'mime-types';

/**
 * Tries to guess the MIME type of an image based on the initial bytes (magic numbers) of its base64 representation.
 * This function only handles a few common image types and is not exhaustive.
 *
 * @param {string} base64String - The base64 encoded string of the image.
 * @returns {string|null} The guessed MIME type or false if unable to guess.
 */
export const guessMimeTypeFromBase64 = (base64String) => {
  // Decode the first few bytes of the base64 string to a binary string
  const binaryStr = atob(base64String.substring(0, 50)); // Decode a portion to check magic numbers

  const byteArr = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i += 1) {
    byteArr[i] = binaryStr.charCodeAt(i);
  }

  // Common image format magic numbers
  if (byteArr[0] === 0xff && byteArr[1] === 0xd8 && byteArr[2] === 0xff) {
    return 'image/jpeg';
  }
  if (byteArr[0] === 0x89 && byteArr[1] === 0x50 && byteArr[2] === 0x4e && byteArr[3] === 0x47) {
    return 'image/png';
  }
  if (byteArr[0] === 0x47 && byteArr[1] === 0x49 && byteArr[2] === 0x46) {
    return 'image/gif';
  }
  if (byteArr[0] === 0x42 && byteArr[1] === 0x4d) {
    return 'image/bmp';
  }
  if (byteArr[0] === 0x49 && byteArr[1] === 0x49 && byteArr[2] === 0x2a && byteArr[3] === 0x00) {
    return 'image/tiff';
  }
  if (byteArr[0] === 0x4d && byteArr[1] === 0x4d && byteArr[2] === 0x00 && byteArr[3] === 0x2a) {
    return 'image/tiff';
  }

  // If no known signature is found, return false
  return false;
};

/**
 * Determines the MIME type of a file based on its extension or base64 string.
 *
 * @param {string} input - A file extension
 * @param {string} base64 - A base64 string representation of the file
 * @returns {string} The MIME type if found, otherwise tries to guess based on base64 content. Returns false if unable to determine.
 */
export const getMimeType = (source, base64) => {
  // Try to lookup the MIME type based on the input directly (assuming it might be a file extension)
  let mimeType = mimeTypes.lookup(source);

  // If lookup fails and the input is a base64 string (without the MIME type prefix), try to guess the MIME type
  if (!mimeType && base64 && base64.length > 0) {
    mimeType = guessMimeTypeFromBase64(base64);
  }

  return mimeType;
};
