"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
<<<<<<< HEAD
import { LiveInterview, MockInterview } from "@/utils/schema";
=======
import { LiveHelpInterview, MockInterview } from "@/utils/schema";
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const [isBasicInterivew, setIsBasicInterivew] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
=======
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
    try {
      let result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result.length > 0) {
        setInterviewData(result[0]);
        return;
      }

<<<<<<< HEAD
      result = await db
        .select()
        .from(LiveInterview)
        .where(eq(LiveInterview.mockId, params.interviewId));
=======
      console.log("isBasicInterivew", isBasicInterivew)
      result = await db
        .select()
        .from(LiveHelpInterview)
        .where(eq(LiveHelpInterview.mockId, params.interviewId));
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd

      if (result.length > 0) {
        setInterviewData(result[0]);
        return;
      }

      toast.error("Interview details not found");
    } catch (error) {
      toast.error("Error fetching interview details");
      console.error("Interview details fetch error:", error);
    }
  };

  const handleWebcamToggle = () => {
    if (!webCamEnabled) {
<<<<<<< HEAD
      navigator.mediaDevices
        .getUserMedia({ video: true })
=======
      navigator.mediaDevices.getUserMedia({ video: true })
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
        .then(() => {
          setWebCamEnabled(true);
          toast.success("Webcam and microphone enabled");
        })
        .catch((error) => {
          toast.error("Failed to access webcam or microphone");
          console.error("Webcam access error:", error);
        });
    } else {
      setWebCamEnabled(false);
    }
  };

  let numberOfQuestions = 5;
  if (isBasicInterivew) {
<<<<<<< HEAD
    numberOfQuestions =
      interviewData &&
      interviewData?.jsonMockResp &&
      JSON.parse(interviewData?.jsonMockResp).length;
=======
    numberOfQuestions = interviewData && interviewData?.jsonMockResp && JSON.parse(interviewData?.jsonMockResp).length;
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
  }

  if (!interviewData) {
    return <div>Loading interview details...</div>;
  }

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's get started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          <div className="flex flex-col p-5 rounded-lg border gap-5">
            <h2 className="text-lg">
              <strong>Job Role/Job Position: </strong>
              {interviewData.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack: </strong>
              {interviewData.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience: </strong>
<<<<<<< HEAD
              {interviewData.experience}
=======
              {interviewData.jobExperience}
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <span>Information</span>
            </h2>
<<<<<<< HEAD
            <h2 className="mt-3 text-yellow-500">
              {`Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. 
                It has ${numberOfQuestions} questions which you can answer and will provide a report based on your answers. 
                NOTE: We never record your video. Web cam access can be disabled at any time.`}
=======
            <h2 className="mt-3 text-yellow-500">{
                `Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. 
                It has ${numberOfQuestions} questions which you can answer and will provide a report based on your answers. 
                NOTE: We never record your video. Web cam access can be disabled at any time.`
              }
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
            </h2>
          </div>
        </div>
        <div>
          {webCamEnabled ? (
            <Webcam
              mirrored={true}
              style={{ height: 300, width: "auto" }}
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => {
                toast.error("Webcam access error");
                setWebCamEnabled(false);
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 my-7 border rounded-lg w-full p-20 bg-secondary" />
              <Button
                className="w-full"
                variant="ghost"
                onClick={handleWebcamToggle}
              >
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
<<<<<<< HEAD
        {isBasicInterivew ? (
          interviewData.submitted ? (
            <Link href={`/dashboard/interview/${params.interviewId}/feedback`}>
              <Button>Feedback</Button>
            </Link>
          ) : (
            <Link href={`/dashboard/interview/${params.interviewId}/start`}>
              <Button>Start Interview</Button>
            </Link>
          )
        ) : (
=======
        {isBasicInterivew ? (interviewData.submitted ? (
          <Link href={`/dashboard/interview/${params.interviewId}/feedback`}>
            <Button>Feedback</Button>
          </Link>
        ) : (
          <Link href={`/dashboard/interview/${params.interviewId}/start`}>
            <Button>Start Interview</Button>
          </Link>
        )) : (
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
          <Link href={`/dashboard/interview/${params.interviewId}/live-help`}>
            <Button>Get Live Help</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default Interview;
=======
export default Interview;
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
