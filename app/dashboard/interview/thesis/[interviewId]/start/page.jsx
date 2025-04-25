"use client";
import { db } from "@/utils/db";
import { Interview, ThesisInterview, MockInterview } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const StartInterview = ({ params }) => {
  const { user } = useUser();
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  let email;

  const getInterview = async () => {
    try {
      const res = await db
        .select({
          interview: Interview,
          mockInterview: MockInterview,
          thesisInterview: ThesisInterview,
        })
        .from(Interview)
        .innerJoin(MockInterview, eq(Interview.id, MockInterview.interviewId))
        .innerJoin(
          ThesisInterview,
          eq(Interview.id, ThesisInterview.interviewId)
        )
        .where(
          and(
            eq(Interview.id, params.interviewId),
            eq(Interview.status, 1),
            eq(Interview.createdBy, email)
          )
        )
        .limit(1);

      if (res.length <= 0) {
        throw new Error("Interview data not found");
      }

      let qna = await JSON.parse(res[0]?.mockInterview?.qna)?.qna;
      setMockInterviewQuestion(qna);

      delete res[0]?.mockInterview?.qna;
      setInterviewData(res[0]);
    } catch (err) {
      console.error("Error fetching thesis interview:", err);
      toast.error(err.message || "Failed to fetch thesis interview");
    } finally {
      setLoading(false);
    }
  };

  const submitInterview = async () => {
    try {
      await db
        .update(MockInterview)
        .set({ submitted: true })
        .where(eq(MockInterview.interviewId, interviewData?.interview?.id));

      setLoading(false);
      router.push(
        `/dashboard/interview/thesis/${interviewData?.interview?.id}/feedback`
      );
      return;
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerSave = (answerRecord) => {
    // Optional: Add any additional logic when an answer is saved
    // For example, you might want to automatically move to the next question
    if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    email = user?.primaryEmailAddress?.emailAddress;
    getInterview();
  }, [user]);

  if (loading) {
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

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <QuestionsSection
          key={activeQuestionIndex}
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        {/* video or audio recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
          onAnswerSave={handleAnswerSave}
        />
      </div>
      <div className="flex justify-end gap-6 my-6">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          >
            Previous Question
          </Button>
        )}
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex == mockInterviewQuestion?.length - 1 && (
          <Link
            href={
              "/dashboard/interview/" +
              interviewData?.interview?.id +
              "/feedback"
            }
          >
            <Button onClick={submitInterview}>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
