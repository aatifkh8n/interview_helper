"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import {
  Interview,
  LiveInterview,
  MockInterview,
  JobInterview,
} from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

function JobInterviewComp({ params }) {
  const [interview, setInterview] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [isBasicInterivew, setIsBasicInterivew] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  let email;

  let interviewType = 10;

  useEffect(() => {
    email = user?.primaryEmailAddress?.emailAddress;
    getJobInterviewDetails();
  }, [user]);

  const getJobInterviewDetails = async () => {
    setIsLoading(true);
    try {
      let res = await db
        .select()
        .from(Interview)
        .where(
          and(
            eq(Interview.id, params.interviewId),
            eq(Interview.status, 1),
            eq(Interview.createdBy, email)
          )
        );

      interviewType = res[0]?.type;
    } catch (err) {
      console.log(err);
    } finally {
    }

    try {
      let baseQuery = db
        .select()
        .from(Interview)
        .innerJoin(JobInterview, eq(Interview.id, JobInterview.interviewId))
        .where(
          and(
            eq(Interview.id, params.interviewId),
            eq(Interview.status, 1),
            eq(Interview.createdBy, email)
          )
        );

      // Conditionally join MockInterview or LiveInterview
      if (interviewType === 0) {
        baseQuery = baseQuery.innerJoin(
          MockInterview,
          eq(Interview.id, MockInterview.interviewId)
        );
      } else {
        baseQuery = baseQuery.innerJoin(
          LiveInterview,
          eq(Interview.id, LiveInterview.interviewId)
        );
      }

      const result = await baseQuery;

      if (result.length <= 0) {
        toast.error("Interview details not found");
        return;
      }

      let interviewSpecificData = result[0]?.mockInterview;
      if (interviewType === 1) {
        interviewSpecificData = result[0]?.liveInterview;
      }

      interviewSpecificData = {
        ...result[0].interview,
        ...interviewSpecificData,
        ...result[0].jobInterview,
      };

      setInterview(interviewSpecificData);
      console.log(interviewSpecificData);
      toast.error("Interview details fetched");
    } catch (error) {
      toast.error("Error fetching interview details");
      console.error("Interview details fetch error:", error);
    } finally {
      setIsLoading(false);
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
      interview &&
      interview?.jsonMockResp &&
      JSON.parse(interview?.jsonMockResp).length;
  }

  if (!interview) {
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
              {interview.position}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack: </strong>
              {interview.description}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience: </strong>
              {interview.experience}
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
          interview.submitted ? (
            <Link href={`/dashboard/interview/${params.interviewId}/feedback`}>
              <Button>Feedback</Button>
            </Link>
          ) : (
            <Link href={`/dashboard/interview/job/${params.interviewId}/start`}>
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

export default JobInterviewComp;
