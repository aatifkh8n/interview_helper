import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
<<<<<<< HEAD
import { Interview, MockInterview } from "@/utils/schema";
import {
  Trash2,
  FileUp,
  MessageSquareWarning,
  Video,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const InterviewItem = ({ interview, getInterviewList, index }) => {
=======
import { MockInterview } from "@/utils/schema";
import { Trash2, Play, BotMessageSquare, FileUp, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const InterviewItem = ({ interview, index }) => {
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onStart = () => {
<<<<<<< HEAD
    router.push(
      `/dashboard/interview/${interviewTypeMap[
        interview?.subInterviewType
      ].toLowerCase()}/${interview?.id}/start`
    );
  };

  const onFeedbackPress = () => {
    router.push(
      `/dashboard/interview/${interviewTypeMap[
        interview?.subInterviewType
      ].toLowerCase()}/${interview?.id}/feedback`
    );
  };

  const onLive = () => {
    router.push(
      `/dashboard/interview/${interviewTypeMap[
        interview?.subInterviewType
      ].toLowerCase()}/${interview?.id}/live`
    );
=======
    router.push(`/dashboard/interview/${interview?.mockId}/start`);
  };

  const onFeedbackPress = () => {
    router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
  };

  const onDelete = async () => {
    try {
      await db
<<<<<<< HEAD
        .update(Interview)
        .set({ status: 0 })
        .where(eq(Interview.id, interview?.id));

      getInterviewList();
=======
        .delete(MockInterview)
        .where(eq(MockInterview.mockId, interview?.mockId));
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd

      // Close dialog and show success toast
      setIsDialogOpen(false);
      toast.success("Interview deleted successfully");

      // Use router to refresh instead of full page reload
      router.refresh();
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview");
    }
  };

<<<<<<< HEAD
  const interviewTypeMap = {
    0: "Job",
    1: "Thesis",
    2: "Educational",
  };

=======
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
  return (
    <tr>
      <td className="px-6 py-4">{index}</td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
<<<<<<< HEAD
        <Link
          href={`/dashboard/interview/${interviewTypeMap[
            interview?.subInterviewType
          ].toLowerCase()}/${interview?.id}`}
        >
          {interview?.title}
        </Link>
      </th>
      <td className="px-6 py-4">{interview?.experience || "-"}</td>
      <td className="px-6 py-4">{interview?.createdAt}</td>
      <td className="px-6 py-4">
        {interviewTypeMap[interview?.subInterviewType]}
      </td>
      <td className="px-6 py-4">
        {interview?.type === 0 ? (
          <span className="text-secondaryColor font-medium">Mock</span>
        ) : (
          <span className="text-primaryColor-level1 font-medium">Live</span>
        )}
      </td>
      <td className="px-6 py-4 text-center">
        {}
        {interview?.type === 0 ? (
          interview?.submitted ? (
            <Button
              size="sm"
              variant="muted"
              onClick={onFeedbackPress}
              className="mr-2 text-secondaryColor hover:text-secondaryColor/80"
              title="Feedback"
            >
              <MessageSquareWarning />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="muted"
              onClick={onStart}
              title="Start"
              className="mr-2 text-secondaryColor hover:text-secondaryColor/80"
            >
              <Play />
            </Button>
          )
        ) : (
          <Button
            size="sm"
            variant="muted"
            onClick={onLive}
            title="Live Help"
            className="mr-2 text-primaryColor hover:text-primaryColor/80"
          >
            <Video />
=======
        <Link href={`/dashboard/interview/${interview?.mockId}`}>
          {interview.type === 1 && <FileUp className="float-left mr-1" />}
          {interview?.jobPosition}
        </Link>
      </th>
      <td className="px-6 py-4">{interview?.jobExperience || "N/A"}</td>
      <td className="px-6 py-4">{interview?.createdAt}</td>
      <td className="px-6 py-4 text-center">
        {interview.submitted ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onFeedbackPress}
            className="mr-2"
            title="Feedback"
          >
            <MessageSquareText />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={onStart}
            title="Start"
            className="mr-2"
          >
            <Play />
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
          </Button>
        )}

        <Button
          size="sm"
<<<<<<< HEAD
          variant="muted"
          // className="absolute top-2 right-2 flex items-center justify-center"
          onClick={() => setIsDialogOpen(true)}
          title="Delete"
          className="text-red-600 hover:text-red-500"
        >
          <Trash2 />
=======
          variant="outline"
          // className="absolute top-2 right-2 flex items-center justify-center"
          onClick={() => setIsDialogOpen(true)}
          title="Delete"
          className="hover:bg-red-100"
        >
          <Trash2 className="text-red-600" />
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
        </Button>
      </td>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete this interview?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onDelete}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </tr>
  );
};

export default InterviewItem;
