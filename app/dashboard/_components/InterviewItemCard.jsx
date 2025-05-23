import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import { Trash, FileUp } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onStart = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`);
  };

  const onFeedbackPress = () => {
    router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
  };

  const onDelete = async () => {
    try {
      await db
        .delete(MockInterview)
        .where(eq(MockInterview.mockId, interview?.mockId));

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

  return (
<<<<<<< HEAD
    <div className="relative border shadow-sm rounded-sm p-3 flex flex-col justify-end">
=======
    <div
      className="relative border shadow-sm rounded-sm p-3 flex flex-col justify-end"
    >
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
      {/* Delete button in the top-right corner */}
      <Button
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 flex items-center justify-center"
        onClick={() => setIsDialogOpen(true)}
        title="Delete"
      >
        <Trash className="text-red-600" />
      </Button>

      {/* Card Content */}
      <div>
        {/* {interview.type === 1 && (<h2 className="text-sm text-gray-400">File-based</h2>)} */}
        <h2 className="font-bold text-primary cursor-pointer">
          {interview.type === 1 && <FileUp className="float-left mr-1" />}
          <Link href={`/dashboard/interview/${interview?.mockId}`}>
            {interview?.jobPosition}
          </Link>
        </h2>
        {/* <h2 className="text-sm text-gray-500">Question(s): {JSON.parse(interview?.jsonMockResp).length}</h2> */}
        <h2 className="text-sm text-gray-500">
<<<<<<< HEAD
          Experience: {interview?.experience} Year(s)
=======
          Experience: {interview?.jobExperience} Year(s)
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
        </h2>
        <h2 className="text-sm text-gray-500">
          Created At: {interview?.createdAt}
        </h2>
      </div>

      <div className="flex justify-between gap-5 mt-2">
        {/* {isRecording ?
          (
            <Button size="sm" variant="outline" className="w-full text-red-600 hover:text-red-600" onClick={onStopCapturing}>Stop Capturing</Button>
          ) : ( */}
        <Button size="sm" variant="outline" className="w-full">
          <Link href={`/dashboard/interview/${interview?.mockId}/live-help`}>
            Live Help
          </Link>
        </Button>
        {/* )
        } */}
        {interview.submitted ? (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={onFeedbackPress}
          >
            Feedback
          </Button>
        ) : (
          <Button className="w-full" size="sm" onClick={onStart}>
            Start
          </Button>
        )}
      </div>

      {/* Confirmation Dialog */}
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
    </div>
  );
};

export default InterviewItemCard;
