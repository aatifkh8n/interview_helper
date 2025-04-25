import React from "react";
import { Captions } from "lucide-react";

const TranscribeText = ({ isPlaying, conversation }) => {
  return (
    <div className="p-5 border rounded-lg border-gray-300 bg-gray-100 h-60">
      <h2 className="flex gap-2 items-center text-gray-500">
        <Captions />
        <span>Transcribed text {!isPlaying && "goes here"}</span>
        {isPlaying && (
          <span className="fadeInOutAnimation justify-end items-end text-yellow-500">
            {" "}
            ⦿ Listening
          </span>
        )}
      </h2>
      <p className="mt-3 text-gray-500 text-sm max-h-36 overflow-y-auto pr-2">
        {conversation
          .filter((item) => item.type === "question")
          .map((item, index) => (
            <div
              key={index}
              className="mb-2 p-2 bg-white rounded-md shadow-sm relative"
            >
              <p>{item.text}</p>
            </div>
          ))}
      </p>
    </div>
  );
};

export default TranscribeText;
