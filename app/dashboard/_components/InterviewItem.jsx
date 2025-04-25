import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
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
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onStart = () => {
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
  };

  const onDelete = async () => {
    try {
      await db
        .update(Interview)
        .set({ status: 0 })
        .where(eq(Interview.id, interview?.id));

      getInterviewList();

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

  const interviewTypeMap = {
    0: "Job",
    1: "Thesis",
    2: "Educational",
  };

  return (
    <tr>
      <td className="px-6 py-4">{index}</td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
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
          </Button>
        )}

        <Button
          size="sm"
          variant="muted"
          // className="absolute top-2 right-2 flex items-center justify-center"
          onClick={() => setIsDialogOpen(true)}
          title="Delete"
          className="text-red-600 hover:text-red-500"
        >
          <Trash2 />
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
