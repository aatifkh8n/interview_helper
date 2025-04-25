"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
=======
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import Link from 'next/link';
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd

const StartInterview = ({ params }) => {
  const [interViewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

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
      setIsLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result.length === 0) {
        setIsLoading(false);
<<<<<<< HEAD
        router.push("/dashboard/");
        toast.error("Interview cannot be started");
        return;
      }

=======
        router.push('/dashboard/');
        toast.error("Interview cannot be started");
        return;
      }
      
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
      if (result[0].submitted) {
        setIsLoading(false);
        router.push(`/dashboard/interview/${params.interviewId}/feedback`);
        toast.error("Already responded");
        return;
      }

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Failed to fetch interview details:", error);
      // Optionally add error toast or error state handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSave = (answerRecord) => {
    // Optional: Add any additional logic when an answer is saved
    // For example, you might want to automatically move to the next question
    if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
<<<<<<< HEAD
      setActiveQuestionIndex((prev) => prev + 1);
=======
      setActiveQuestionIndex(prev => prev + 1);
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin" />
          <p className="mt-4 text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">No interview questions found.</p>
      </div>
    );
  }

  const submitInterview = async () => {
    try {
<<<<<<< HEAD
      console.log(interViewData);
=======
      console.log(interViewData)
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
      await db
        .update(MockInterview)
        .set({ submitted: true })
        .where(eq(MockInterview.id, interViewData.id));

      setIsLoading(false);
      router.push(`/dashboard/interveiw/${interviewId}/feedback`);
      return;
    } catch (err) {
      console.log(err);
    }
<<<<<<< HEAD
  };
=======
  }
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        {/* video or audio recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interViewData}
          onAnswerSave={handleAnswerSave}
        />
      </div>
      <div className="flex justify-end gap-6 my-6">
        {activeQuestionIndex > 0 && (
<<<<<<< HEAD
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          >
=======
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
            Previous Question
          </Button>
        )}
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 && (
<<<<<<< HEAD
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
          >
=======
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
            Next Question
          </Button>
        )}
        {activeQuestionIndex == mockInterviewQuestion?.length - 1 && (
<<<<<<< HEAD
          <Link
            href={"/dashboard/interview/" + interViewData?.mockId + "/feedback"}
          >
=======
          <Link href={'/dashboard/interview/' + interViewData?.mockId + '/feedback'}>
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
            <Button onClick={submitInterview}>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default StartInterview;
=======
export default StartInterview;
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
