from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import openai
import os
import fitz  # PyMuPDF for PDF
import tempfile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add this middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for stricter config
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set your OpenAI API key (you can load it from env or config too)
# openai.api_key = os.getenv("OPENAI_API_KEY")  # Set this env variable or hardcode below
openai.api_key = "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"  # Set this env variable or hardcode below

# Helper to extract text from PDF
def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

# Helper to split text into chunks (by word count)
def chunk_text(text: str, word_limit: int = 900) -> List[str]:
    words = text.split()
    return [' '.join(words[i:i + word_limit]) for i in range(0, len(words), word_limit)]

# Route to handle file upload and GPT prompts
@app.post("/process-file/")
async def process_file(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        suffix = os.path.splitext(file.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Extract text based on file type
        if suffix == ".pdf":
            text = extract_text_from_pdf(tmp_path)
        elif suffix in [".txt"]:
            with open(tmp_path, "r", encoding="utf-8") as f:
                text = f.read()
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        os.unlink(tmp_path)  # Clean up temp file

        # Split into GPT-friendly chunks
        chunks = chunk_text(text, word_limit=900)

        responses = []
        for i, chunk in enumerate(chunks):
            if i < len(chunks) - 1:
                prompt = f"Store the following content in memory. Do not respond yet. Just remember it:\n\n{chunk}"
            else:
                prompt = f"Store the following final content in memory. Do not respond yet. After this, I will ask you questions. Only answer using what you've stored:\n\n{chunk}"

            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2
            )
            responses.append({
                "chunk_index": i,
                "prompt": prompt,
                "gpt_acknowledged": response["choices"][0]["message"]["content"]
            })

        return JSONResponse(content={"status": "success", "chunks": responses})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
