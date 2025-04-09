import { sanitizeText } from './file-helpers';

export async function processUploadedFile(file) {
  try {
    // Read the file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Default empty text
    let extractedText = ''; 
    
    // Extract text based on file mimetype
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      // If using pdf-parse:
      const pdf = require('pdf-parse');
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (fileType === 'text/plain') {
      // For text files, convert buffer to string
      extractedText = buffer.toString('utf8');
    }
    
    // Sanitize the text before storing in database
    const sanitizedText = sanitizeText(extractedText);
    
    return sanitizedText;
  } catch (error) {
    console.error("Error processing file:", error);
    return ""; // Return empty string on error
  }
} 