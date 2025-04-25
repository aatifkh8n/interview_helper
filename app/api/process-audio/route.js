import { NextResponse } from "next/server";
import formidable from "formidable";
import { Readable } from "stream";
import { transcribeAudio } from '../../../utils/process-audio';



export async function POST(req) {
  try {
    // Read the request body into an ArrayBuffer and convert it to a Buffer.
    const buf = await req.arrayBuffer();
    const buffer = Buffer.from(buf);

    // Create a Node.js Readable stream from the buffer.
    const stream = Readable.from(buffer);

    // Convert Next.js Request headers (a Headers object) to a plain object.
    const headers = Object.fromEntries(req.headers.entries());

    // Ensure the "content-length" header is set.
    if (!headers["content-length"]) {
      headers["content-length"] = buffer.byteLength.toString();
    }

    // Attach the headers to the stream so that formidable can read them.
    stream.headers = headers;

    const form = formidable();

    // Wrap formidable parsing in a Promise so we can await it.
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(stream, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

 

    // Access the uploaded audio file by the "audio" key.
    const audioFile = files.audio;

    const transcribedText = transcribeAudio(audioFile[0].filepath);

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // If you only expect one file, audioFile might be an object,
    // otherwise, if multiples were allowed it might be an array.
    // For simplicity, we assume one file.
    // console.log("Audio File:", audioFile);

    return NextResponse.json(
      { message: "File uploaded successfully", audioFile, transcribedText },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error parsing form:", error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 400 }
    );
  }
}
