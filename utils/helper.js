import * as pdfjsLib from "pdfjs-dist";
import pdfToText from "react-pdftotext";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

function sanitizeText(text) {
  if (!text) return "";
  let sanitized = text.replace(/\0/g, "");
  sanitized = sanitized.replace(/[\uFFFD\uFFFE\uFFFF]/g, "");
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return sanitized;
}

export const processDocument = async (uploadedFile) => {
  const fileType = uploadedFile.type;

  let res = null;

  if (fileType === "application/pdf") {
    res = await extractTextFromPDF(uploadedFile);
    console.log("file processed successfully", res);
  } else if (fileType === "text/plain") {
    const text = extractTextFromTextFile(uploadedFile);
    res = await sanitizeText(text);
  } else {
    toast.error("Unsupported file type");
    setFile(null);
  }

  return res;
};

const extractTextFromPDF = async (file) => {
  return pdfToText(file)
    .then((text) => sanitizeText(text))
    .catch((err) => console.error("Failed to extract text from pdf", err));
};

const extractTextFromTextFile = (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
