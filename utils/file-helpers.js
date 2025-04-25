/**
 * Sanitizes text by removing null bytes and other invalid UTF-8 characters
 * @param {string} text - The text to sanitize
 * @returns {string} Sanitized text safe for database storage
 */
export function sanitizeText(text) {
  if (!text) return '';
  
  // Remove null bytes (0x00)
  let sanitized = text.replace(/\0/g, '');
  
  // Replace other potentially problematic characters
  sanitized = sanitized.replace(/[\uFFFD\uFFFE\uFFFF]/g, '');
  
  // Replace control characters except for line breaks and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized;
} 