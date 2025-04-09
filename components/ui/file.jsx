import React, { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfToText from "react-pdftotext";

import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

function sanitizeText(text) {
  if (!text) return "";
  let sanitized = text.replace(/\0/g, "");
  sanitized = sanitized.replace(/[\uFFFD\uFFFE\uFFFF]/g, "");
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return sanitized;
}

const DocumentUpload = ({ fileText, setFileText, className , MAX_FILE_SIZE_MB, children}) => {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null); // Ref to clear the input field


  // const MAX_FILE_SIZE_MB = 5;
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];

  if (!uploadedFile) return;

  const fileSizeMB = uploadedFile.size / (1024 * 1024); // Convert bytes to MB
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    toast.error(`File Size must be less than ${MAX_FILE_SIZE_MB} MB`)
    event.target.value = null; // Clear the input
    return;
  }
  if(uploadedFile.type  !== "application/pdf" && uploadedFile.type  !== "text/plain"){
    toast.error(`This type of file not supported`)
    event.target.value = null; // Clear the input
    return;
  }

  setFile(uploadedFile);
  processDocument(uploadedFile);
  };

  const handleFileRemove = () => {
    setFile(null);
    setFileText("");
    if (inputRef.current) {
      inputRef.current.value = null; // Clear file input
    }
  };

  const processDocument = async (uploadedFile) => {
    const fileType = uploadedFile.type;

    if (fileType === "application/pdf") {
      await extractTextFromPDF(uploadedFile);
    } else if (fileType === "text/plain") {
      const text = await extractTextFromTextFile(uploadedFile);
      setFileText(sanitizeText(text));
    } else {
      toast.error("Unsupported file type");
      setFile(null)
      return;
    }
  };

  const extractTextFromPDF = async (file) => {
    pdfToText(file)
      .then((text) => setFileText(sanitizeText(text)))
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

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        accept=".pdf,.txt"
        onChange={handleFileChange}
        {...children}
      />
      <div className="w-[2px] h-10 rounded-sm absolute top-0 !start-24 bg-gray-500" />
      <div className="absolute end-4 top-3 pointer-events-none text-muted-foreground">
        <Upload className="w-4 h-4" />
      </div>

      {file && (
        <div className="mt-2 flex items-center justify-between bg-muted px-3 py-2 rounded-md text-sm">
          <span className="truncate">{file.name}</span>
          <button
            type="button"
            onClick={handleFileRemove}
            className="ml-2 text-gray-500 hover:text-red-600"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export { DocumentUpload };
