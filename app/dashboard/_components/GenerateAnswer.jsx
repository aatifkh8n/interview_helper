import React from "react";
<<<<<<< HEAD
import { Bot } from "lucide-react";
=======
import { Bot } from 'lucide-react';
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd

const GenerateAnswer = ({ conversation }) => {
  return (
    <div className="flex flex-col my-5 gap-5">
      <div className="p-5 rounded-lg border gap-5 h-full">
        <div className="flex flex-row">
<<<<<<< HEAD
          <Bot className="text-primaryColor mr-2" />
=======
          <Bot className="text-indigo-600 mr-2" />
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
          <span>Generated answers</span>
        </div>

        <div className="my-3 overflow-y-auto h-[28rem] max-h-[28rem] text-sm pr-2">
          {conversation
            .filter((item) => item.type === "answer")
            .map((item, index) => (
<<<<<<< HEAD
              <div
                key={index}
                className="mb-2 p-2 bg-gray-100 rounded-md shadow-sm relative"
              >
                <p>{item.text}</p>
                <button
=======
              <div key={index} className="mb-2 p-2 bg-gray-100 rounded-md shadow-sm relative">
                <p>{item.text}</p>
                <button 
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
                  onClick={(event) => {
                    navigator.clipboard.writeText(item.text);
                    const button = event.currentTarget;
                    const originalContent = button.innerHTML;
                    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>`;
                    setTimeout(() => {
                      button.innerHTML = originalContent;
                    }, 1000);
                  }}
                  className="absolute bottom-2 right-2 p-1 text-gray-500 hover:text-gray-700"
                >
<<<<<<< HEAD
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
=======
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GenerateAnswer;
