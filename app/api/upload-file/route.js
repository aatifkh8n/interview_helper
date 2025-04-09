import { sanitizeText } from '@/utils/file-helpers';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const interviewId = formData.get('interviewId');
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400 }
      );
    }
    
    // Process file and get text
    let fileText = '';
    
    // Handle different file types
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Extract text using pdf-parse or similar
      // For example:
      // const pdf = require('pdf-parse');
      // const data = await pdf(buffer);
      // fileText = data.text;
    } else if (file.type === 'text/plain') {
      const text = await file.text();
      fileText = text;
    }
    
    // Double ensure sanitization before storing
    fileText = sanitizeText(fileText);
    
    // Check if there's still any invalid characters
    if (fileText.includes('\0')) {
      console.error("Sanitization failed to remove all null bytes");
      fileText = fileText.replace(/\0/g, ''); // Try again with a direct replace
    }
    
    // Store in database
    await db.update(MockInterview)
      .set({ fileText: fileText })
      .where(eq(MockInterview.id, interviewId));
    
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error processing file:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
} 