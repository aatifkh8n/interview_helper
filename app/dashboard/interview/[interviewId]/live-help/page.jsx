"use client";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { eq } from "drizzle-orm";

import TabScreenShare from "@/app/dashboard/_components/TabScreenShare";
import TranscribeText from "@/app/dashboard/_components/TranscribeText";
import GenerateAnswer from "@/app/dashboard/_components/GenerateAnswer";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stream, setStream] = useState(null);
  const [conversation, setConversation] = useState([]);

  const router = useRouter();

  useEffect(() => {
    GetInterviewDetails();

    // const transcribeInterval = setInterval(() => {
    //     const text = transcribeSpeech('test');
    //     }, 2000);

    //     return () => clearInterval(transcribeInterval);
  }, []);

  useEffect(() => {
    // Cleanup function when component unmounts to stop the media stream
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    console.log("conversation in the useEffect:", conversation);
  }, [conversation]);

  const setIsPlayingCallback = useCallback(val => {
    setIsPlaying(val);
  }, []);

  async function handleTranscribedQuestion(questionText) {
    // Add the question to the responses
    setConversation((prev) => [
      ...prev,
      { type: "question", text: questionText },
    ]);
    try {
      // Make the API request
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${Math.ceil(
          Math.random() * 200
        )}`,
        {
          method: "GET" /* ,
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ question: questionText }) */,
        }
      );

      const data = await response.json();

      // Append the answer to the responses
      setConversation((prev) => [
        ...prev,
        { type: "answer", text: data.title },
      ]);
    } catch (error) {
      console.error("Error fetching the answer:", error);
    }
  }

  const generateAnswer = async (question) => {
    let answer;
    try {
      // Make the API request
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${Math.ceil(
          Math.random() * 200
        )}`
      );

      const data = await response.json();
      answer = data.title;
      console.log("answer:", answer);

      // Append the answer to the conversation
      setConversation((prev) => [...prev, { type: "answer", text: answer }]);

      console.log("conversation:", conversation);
    } catch (error) {
      console.error("Error fetching the answer:", error);
    }

    return answer;
  };

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result.length > 0) {
        setInterviewData(result[0]);
      } else {
        toast.error("Interview details not found");
      }
    } catch (error) {
      toast.error("Error fetching interview details");
      console.error("Interview details fetch error:", error);
    }
  };

  let numberOfQuestions = 5;
  numberOfQuestions =
    interviewData && JSON.parse(interviewData?.jsonMockResp).length;

  if (!interviewData) {
    return <div>Loading interview details...</div>;
  }

  const leave = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stops the stream
        setStream(null);
      }
      router.push(`/dashboard`);
  }

  return (
    <div className="my-10">
      <div className="flex justify-between items-center w-full">
        <h2 className="font-bold text-2xl inline-block">Let's help you out</h2>

        <div className="flex justify-end items-center">
          <Button
            variant="outline"
            onClick={() => setConversation([])}
          >
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
          <TabScreenShare setIsPlaying={setIsPlayingCallback} setConversation={setConversation} mockInterview={interviewData} />
          <TranscribeText isPlaying={isPlaying} conversation={conversation} />
        </div>

        {/* Second div */}
        <GenerateAnswer conversation={conversation} />
      </div>
    </div>
  );
}

export default Interview;
