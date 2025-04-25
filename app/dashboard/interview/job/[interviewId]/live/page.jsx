"use client";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { and, eq } from "drizzle-orm";

import TabScreenShare from "@/app/dashboard/_components/TabScreenShare";
import TranscribeText from "@/app/dashboard/_components/TranscribeText";
import GenerateAnswer from "@/app/dashboard/_components/GenerateAnswer";
import { db } from "@/utils/db";
import { Interview, JobInterview, LiveInterview } from "@/utils/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";

function InterviewComp({ params }) {
  const { user } = useUser();
  const [interviewData, setInterviewData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stream, setStream] = useState(null);
  const [conversation, setConversation] = useState([]);

  const router = useRouter();

  let email;

  const setIsPlayingCallback = useCallback((val) => {
    setIsPlaying(val);
  }, []);

  const getInterviewDetails = async () => {
    try {
      const result = await db
        .select({
          interview: Interview,
          liveInterview: LiveInterview,
          jobInterview: JobInterview,
        })
        .from(Interview)
        .innerJoin(LiveInterview, eq(Interview.id, LiveInterview.interviewId))
        .innerJoin(JobInterview, eq(Interview.id, JobInterview.interviewId))
        .where(
          and(
            eq(Interview.id, params.interviewId),
            eq(Interview.status, 1),
            eq(Interview.createdBy, email)
          )
        )
        .limit(1);

      if (result.length === 0) {
        router.push("/dashboard/interview/job");
        toast.error("We are unable to help you");
        return;
      }

      if (result.length > 0) {
        setInterviewData(result[0]);
      }
    } catch (error) {
      toast.error("Error fetching interview details");
      console.error("Interview details fetch error:", error);
    }
  };

  useEffect(() => {
    email = user?.primaryEmailAddress?.emailAddress;
    if (email) {
      getInterviewDetails();
    }
  }, [user]);

  useEffect(() => {
    // Cleanup function when component unmounts to stop the media stream
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [stream]);

  if (!interviewData) {
    return <div>Loading interview details...</div>;
  }

  const leave = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Stops the stream
      setStream(null);
    }
    router.back();
  };

  return (
    <div className="my-10">
      <div className="flex justify-between items-center w-full">
        <h2 className="font-bold text-2xl inline-block">Let's help you out</h2>

        <div className="flex justify-end items-center">
          <Button variant="outline" onClick={() => setConversation([])}>
            Reset
          </Button>

          <Button variant="destructive" className="ml-2" onClick={leave}>
            Leave
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* First div */}
        <div className="flex flex-col my-5 gap-5">
          <TabScreenShare
            setIsPlaying={setIsPlayingCallback}
            setConversation={setConversation}
            interview={interviewData}
          />
          <TranscribeText isPlaying={isPlaying} conversation={conversation} />
        </div>

        {/* Second div */}
        <GenerateAnswer conversation={conversation} />
      </div>
    </div>
  );
}

export default InterviewComp;
