import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Silence detection parameters
const SILENCE_THRESHOLD = 0.1; // Amplitude threshold (adjust as needed)
const MIN_CHUNK_SILENCE_DURATION = 0.1; // Minimum duration of silence within a small analysis chunk (in seconds)

// Create an AudioContext (can be reused)
// Ensure this runs only in the browser environment
let audioContext;
if (typeof window !== 'undefined') {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

export const processChunks = async (chunks) => {
  console.log("chunks: ", chunks);
  if (chunks.length === 0) {
    console.log("No chunks to process");
    return;
  }
  
  // Get the blob directly from the chunk if it's a single chunk, otherwise create a blob
  const blob = new Blob(chunks, { type: "audio/webm" });
  console.log("Created new blob from chunks");

  console.log("blob size:", blob.size, "bytes");
  console.log("blob type:", blob.type);
  
  // Don't try to transcribe if the blob is too small (likely empty or corrupt)
  if (blob.size < 100) {
    console.log("Audio blob too small, skipping transcription");
    return null;
  }

  return blob;
};

export async function transcribeAudio(blob) {
  try {
    // Directly use the blob's type rather than forcing a specific type
    const fileName = `audio_${Date.now()}.${blob.type.split('/')[1]}`;
    const file = new File([blob], fileName, { type: blob.type });
    
    console.log("file object:", file);
    
    try {
      const response = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        language: "en",
        response_format: "text",
      });
      
      console.log("Transcription response:", response);

      if (!response) {
        console.log("No text found in transcription response");
        return null;
      }
      
      return response;
    } catch (apiError) {
      console.error("OpenAI API Error:", apiError);
      // Log more detailed information about the error
      // if (apiError.status) {
      //   console.error(`Status code: ${apiError.status}`);
      // }

      // if (apiError.message) {
      //   console.error(`Error message: ${apiError.message}`);
      // }
      return null;
    }
  } catch (error) {
    console.error("Error preparing file for transcription:", error);
    return null;
  }
}

export const generateResponse = async (text, extras={}) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an interviewee who applied for the job role: "${extras?.jobPosition}" with job description: "${extras?.jobDesc}" who must be answering the interviewer for only the complete and undersatandable questions (not empty quesitons) but answers should be short, consice and on the spot. also please try responding like an interviewee either know or not. ${(extras?.fileText && `Generate the answer from the following context only no extra information in the answers your answer shouldn't say like doc don't have that information and like that: ${extras?.fileText}`)} 
          
          
          answer should only be given to the complete and related questions (empty and irrelated questions and question containing only single word (you) should be marked irrelevant) and be in a json form as below: 
          {
            "answer": "answer to the question",
            "related": tell is question is related or not by say true or false,
            "percentMatch": how much the question is related to the document out of 100 like 68
          }`
        },
        {
          role: "user", 
          content: text
        }
      ],
    });
    
    const response = await JSON.parse(completion?.choices[0]?.message?.content);
    
    if (!response) {
      console.error("No response from GPT-4");
      return null;
    }

    const cleanedResponse = { question: text, ...response };
    console.log("GPT-4 response:", cleanedResponse);

    if (!cleanedResponse?.related) {
      console.error("Question is irrelevant");
      return null;
    }

    // if (!response || response?.toLowerCase()?.startsWith('no response')) {
    //   console.error("No response from GPT-4");
    //   return null;
    // }

    console.log("Transcribed text:", cleanedResponse?.answer);
    return cleanedResponse?.answer;
  } catch (error) {
    console.error("Error getting GPT-4 response:", error);
  }
}

export const detectSilence = async (blob, minSilenceDurationSeconds) => {
  if (!audioContext) {
    console.error("AudioContext not supported or not in a browser environment.");
    return false; // Cannot detect silence without AudioContext
  }
  if (blob.size < 300) {
    console.log("Blob too small for silence detection.");
    return false; // Avoid processing tiny blobs
  }

  try {
    const arrayBuffer = await blob.arrayBuffer();
    // Add error handling for decodeAudioData
    let audioBuffer;
    try {
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (decodeError) {
       console.error("Error decoding audio data:", decodeError);
       // Try common sample rates if decode fails (sometimes needed for webm/opus)
       const commonSampleRates = [48000, 44100, 24000, 16000];
       let decoded = false;
       for (const rate of commonSampleRates) {
         try {
           const ctx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, arrayBuffer.byteLength / 2, rate); // Approximate length/rate
           audioBuffer = await ctx.decodeAudioData(arrayBuffer);
           console.log(`Successfully decoded with sample rate: ${rate}`);
           decoded = true;
           break;
         } catch (e) { /* ignore */ }
       }
       if (!decoded) {
          console.error("Failed to decode audio data even with common sample rates.");
          return false; // Can't proceed if decoding fails
       }
    }


    const channelData = audioBuffer.getChannelData(0); // Use the first channel
    const sampleRate = audioBuffer.sampleRate;
    const requiredSilentSamples = Math.floor(minSilenceDurationSeconds * sampleRate);
    const analysisChunkSize = Math.floor(MIN_CHUNK_SILENCE_DURATION * sampleRate); // Analyze in smaller chunks

    let consecutiveSilentSamples = 0;

    for (let i = 0; i < channelData.length; i += analysisChunkSize) {
      const end = Math.min(i + analysisChunkSize, channelData.length);
      const chunk = channelData.slice(i, end);

      // Check if the maximum absolute value in the chunk is below the threshold
      let maxAmplitude = 0;
      for (let j = 0; j < chunk.length; j++) {
        const amp = Math.abs(chunk[j]);
        if (amp > maxAmplitude) {
          maxAmplitude = amp;
        }
      }

      if (maxAmplitude < SILENCE_THRESHOLD) {
        consecutiveSilentSamples += chunk.length;
      } else {
        // Reset if non-silent chunk found
        consecutiveSilentSamples = 0;
      }

      // Check if we've met the required duration
      if (consecutiveSilentSamples >= requiredSilentSamples) {
        console.log(`Detected silence of at least ${minSilenceDurationSeconds} seconds.`);
        return true; // Found sufficient silence
      }
    }

    console.log(`No silence duration of ${minSilenceDurationSeconds} seconds detected. Max consecutive samples: ${consecutiveSilentSamples}/${requiredSilentSamples}`);
    return false; // Did not find sufficient silence
  } catch (error) {
    console.error("Error during silence detection:", error);
    return false; // Assume no silence if error occurs
  }
};