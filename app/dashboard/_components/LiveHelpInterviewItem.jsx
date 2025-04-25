import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
<<<<<<< HEAD
=======
import { LiveHelpInterview } from "@/utils/schema";
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
import { Trash2, BotMessageSquare, FileUp } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const LiveHelpInterviewItem = ({ interview, index }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onStart = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`);
  };

  const onDelete = async () => {
    try {
<<<<<<< HEAD
=======
      await db
        .delete(LiveHelpInterview)
        .where(eq(LiveHelpInterview.mockId, interview?.mockId));

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

  return (
    <tr>
      <td className="px-6 py-4">{index}</td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <Link href={`/dashboard/interview/${interview?.mockId}`}>
          {interview.type === 1 && <FileUp className="float-left mr-1" />}
          {interview?.jobPosition}
        </Link>
      </th>
<<<<<<< HEAD
      <td className="px-6 py-4">{interview?.experience || "N/A"}</td>
      <td className="px-6 py-4">{interview?.createdAt}</td>
      <td className="px-6 py-4 text-center">
=======
      <td className="px-6 py-4">{interview?.jobExperience || "N/A"}</td>
      <td className="px-6 py-4">{interview?.createdAt}</td>
      <td className="px-6 py-4 text-center">

>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
        <Button
          size="sm"
          variant="outline"
          title="Live Help"
<<<<<<< HEAD
          className="mr-2 text-primaryColor"
=======
          className="mr-2 text-indigo-600"
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
        >
          <Link href={`/dashboard/interview/${interview?.mockId}/live-help`}>
            <BotMessageSquare />
          </Link>
        </Button>

        <Button
          size="sm"
          variant="outline"
          // className="absolute top-2 right-2 flex items-center justify-center"
          onClick={() => setIsDialogOpen(true)}
          title="Delete"
          className="hover:bg-red-100"
        >
          <Trash2 className="text-red-600" />
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

export default LiveHelpInterviewItem;
