"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { LoaderCircle, Sparkles } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";

import { generateChatResponse } from "@/utils/ChatGPTAIModal";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { TechStack } from "@/utils/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUpload } from "@/components/ui/file";
import Dropdown from "@/components/ui/Dropdown";
import Asterisk from "@/components/ui/asterisk";

let JOB_ROLE_SUGGESTIONS = [];

function AddNewInterview({ isOpen }) {
  const [openDialog, setOpenDialog] = useState(isOpen || false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [questions, setQuestions] = useState();
  const [fileText, setFileText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const { user } = useUser();
  const [selectedOption, setSelectedOption] = useState("Manual");

  let maxFileSize = selectedOption === "Research Document" ? 25 : 5;

  let techStacks = {};

  const router = useRouter();

  useEffect(() => {
    getTechStacks();
  }, []);

  const getTechStacks = async () => {
    const techStackRecord = await db.select().from(TechStack).execute();
    techStackRecord.map((techStack) => {
      techStacks[techStack.techStack] = techStack.suggestions;
    });
    JOB_ROLE_SUGGESTIONS = Object.keys(techStacks);
  };

  const autoSuggestTechStack = (role) => {
    if (techStacks[role]) {
      setJobDescription(techStacks[role]);
      toast.info(`Auto-filled tech stack for ${role}`);
    }
  };
  const [filteredOptions, setFilteredOptions] = useState(JOB_ROLE_SUGGESTIONS);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleBasicFormSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);

    let inputPrompt;

    if (selectedOption === "CV Based") {
      inputPrompt = `Resume Content: ${fileText}.
    Generate ${questions} interview questions and answers in JSON format based on the content of the resume and job description.
    Example output format:
    {
      "jobPosition": "like Software Engineer",
      "jobDesc": "like Python, Scikit-learn, tensorflow",
      "yearsOfExperience": 4
      "interviewData": [{ "question": "Any question here", "answer": "answer here" }]
    }`;
    } else {
      inputPrompt = `Job Position: ${jobPosition}, Years of Experience: ${jobExperience}.
      Generate ${questions} interview questions and answers in JSON format:
      { "interviewData": [{ "question": "Any question here", "answer": "answer here" }] }`;
    }

    try {
      const responseText = await generateChatResponse(inputPrompt);
      const cleanedResponse = responseText
        .replace(/```json\n?|```/g, "")
        .trim();
      const mockResponse = JSON.parse(cleanedResponse);
      
      const questionsArray = mockResponse
        ? Object.values(mockResponse?.interviewData)
        : [];

      const res = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(questionsArray),
          jobPosition: mockResponse?.jobPosition || jobPosition,
          jobDesc: mockResponse?.jobDesc || jobDescription,
          jobExperience: mockResponse?.yearsOfExperience || jobExperience,
          type: (selectedOption === "CV Based") ? 1 : 0,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY HH:mm"),
        })
        .returning({ mockId: MockInterview.mockId });

      toast.success("Interview questions generated successfully!");
      router.push(`dashboard/interview/${res[0]?.mockId}`);
    } catch (error) {
      console.error("Error generating interview:", error);
      toast.error("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setJobPosition(value);
    setFilteredOptions(
      JOB_ROLE_SUGGESTIONS.filter((role) =>
        role.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowDropdown(true);
  };
  const handleFocus = () => {
    setFilteredOptions(JOB_ROLE_SUGGESTIONS); // Show all by default
    setShowDropdown(true);
  };
  const handleOptionClick = (option) => {
    setJobPosition(option);
    setShowDropdown(false);
  };


  const handleLiveHelpSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    let inputPrompt;
  
    if (selectedOption === "Resume") {
      inputPrompt = `Resume Content: ${fileText}. Generate below based on the resume content. Example output format: {"jobPosition": "like Software Engineer", "jobDesc": "like Python, Scikit-learn, tensorflow", "yearsOfExperience": 4}`;
    } else {
      inputPrompt = `Research paper Content: ${fileText}. Generate below based on the research paper content. Example output format: {"jobPosition": "like Software Engineer", "jobDesc": "like Python, Scikit-learn, tensorflow", "yearsOfExperience": 4}`;
    }
  
    try {
      const responseText = await generateChatResponse(inputPrompt);
      const cleanedResponse = responseText
        .replace(/```json\n?|```/g, "")
        .trim();
  
      const mockResponse = JSON.parse(cleanedResponse);
  
      const res = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: {},
          jobPosition: mockResponse?.jobPosition || jobPosition,
          jobDesc: mockResponse?.jobDesc || jobDescription,
          jobExperience: mockResponse?.yearsOfExperience || jobExperience,
          type: 1,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY HH:mm"),
        })
        .returning({ mockId: MockInterview.mockId });
  
      toast.success("We are ready to help you!");
      router.push(`dashboard/interview/${res[0]?.mockId}/live-help`);
    } catch (error) {
      console.error("Error helping you:", error);
      toast.error("Failed to help you.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h1 className="font-bold text-lg text-center">+ Add New</h1>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Create Your Interview Preparation
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div class="w-full">
              <div class="relative right-0">
                <ul
                  class="relative flex flex-wrap px-1.5 py-1.5 list-none rounded-md bg-slate-100"
                  data-tabs="tabs"
                  role="list"
                >
                  <li
                    class="z-30 flex-auto text-center"
                    onClick={() => {
                      setIsLive(false);
                      setSelectedOption("Manual");
                    }}
                  >
                    <a
                      class={`${
                        !isLive && "bg-white"
                      } z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer text-slate-600 bg-inherit`}
                      data-tab-target=""
                      role="tab"
                      aria-selected="true"
                    >
                      Basic
                    </a>
                  </li>
                  <li
                    class="z-30 flex-auto text-center"
                    onClick={() => {
                      setIsLive(true);
                      setSelectedOption("Resume");
                    }}
                  >
                    <a
                      class={`${
                        isLive && "bg-white"
                      } z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer text-slate-600 bg-inherit`}
                      data-tab-target=""
                      role="tab"
                      aria-selected="false"
                    >
                      Live Help
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {!isLive ? (
              <form onSubmit={handleBasicFormSubmission}>
                <div className="w-full mt-3">
                  <label htmlFor="" className="mb-6">
                    Select Method
                  </label>
                  <Dropdown
                    options={["Manual", "CV Based"]}
                    selected={selectedOption}
                    setSelected={(e) => {
                      e.preventDefault?.(); // Prevents form submission
                      setSelectedOption(e.target?.value || e);
                    }}
                  />
                </div>

                {selectedOption === "Manual" && (
                  <>
                    <div className="my-3">
                      <label>
                        Job Role/Position
                        <Asterisk />
                      </label>
                      <div className="relative">
                        <Input
                          placeholder="Ex. Full Stack Developer"
                          value={jobPosition}
                          onChange={handleInputChange}
                          onFocus={handleFocus}
                        />
                        <button
                          id="dropdownDefaultButton"
                          data-dropdown-toggle="dropdown"
                          class="text-black absolute top-2 end-5 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          type="button"
                        >
                          <svg
                            class="w-2.5 h-2.5 ms-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="m1 1 4 4 4-4"
                            />
                          </svg>
                        </button>

                        {showDropdown && (
                          <ul className={`absolute z-10 max-h-44 overflow-y-auto bg-white border rounded-md w-full mt-1 shadow`}>
                            {filteredOptions.map((option) => (
                              <li
                                key={option}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleOptionClick(option)}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="my-3">
                      <label>
                        Job Description / Tech Stack
                        <Asterisk />
                      </label>
                      <Textarea
                        placeholder="Ex. React, Angular, NodeJs, MySql etc"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                    </div>

                    <div className="my-3">
                      <label>
                        Years of Experience
                        <Asterisk />
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="70"
                        value={jobExperience}
                        placeholder="Enter years of experience"
                        onChange={(e) => setJobExperience(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {selectedOption === "CV Based" && (
                  <div className="my-3">
                    <label>
                      Upload resume (Max size: {maxFileSize} MB)
                      <Asterisk />
                    </label>
                    <DocumentUpload
                      fileText={fileText}
                      setFileText={setFileText}
                      MAX_FILE_SIZE_MB={5}
                    />
                  </div>
                )}

                <div className="my-3">
                  <label>
                    Number of Questions
                    <Asterisk />
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="70"
                    value={questions}
                    placeholder="Enter number of questions"
                    onChange={(e) => setQuestions(e.target.value)}
                  />
                </div>

                <div className="flex gap-5 justify-end mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />{" "}
                        Generating
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLiveHelpSubmission}>
                <div className="w-full mt-3">
                  <Dropdown
                    options={["Resume", "Research Document"]}
                    selected={selectedOption}
                    setSelected={setSelectedOption}
                  />
                </div>
                <div className="my-3">
                  <label>
                    Upload{" "}
                    {selectedOption === "Resume" ? "resume" : "research paper"}{" "}
                    (Max size: {maxFileSize} MB)
                    <Asterisk />
                  </label>
                  <DocumentUpload
                    fileText={fileText}
                    setFileText={setFileText}
                    MAX_FILE_SIZE_MB={maxFileSize}
                  />
                </div>

                <div className="my-3 hidden">
                  <label>
                    Number of Questions
                    <Asterisk />
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="70"
                  />
                </div>

                <div className="flex gap-5 justify-end mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" /> Helping
                      </>
                    ) : (
                      "Get Live Help"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
