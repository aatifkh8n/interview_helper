"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { LiveInterview, MockInterview } from "@/utils/schema";
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
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
    try {
      let result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result.length > 0) {
        setInterviewData(result[0]);
        return;
      }

      result = await db
        .select()
        .from(LiveInterview)
        .where(eq(LiveInterview.mockId, params.interviewId));

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
      navigator.mediaDevices
        .getUserMedia({ video: true })
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
    numberOfQuestions =
      interviewData &&
      interviewData?.jsonMockResp &&
      JSON.parse(interviewData?.jsonMockResp).length;
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
              {interviewData.experience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <span>Information</span>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              {`Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. 
                It has ${numberOfQuestions} questions which you can answer and will provide a report based on your answers. 
                NOTE: We never record your video. Web cam access can be disabled at any time.`}
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
          <Link href={`/dashboard/interview/${params.interviewId}/live-help`}>
            <Button>Get Live Help</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Interview;
