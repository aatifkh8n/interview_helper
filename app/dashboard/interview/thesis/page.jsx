"use client";

import {
  ArrowLeft,
  Asterisk,
  LoaderCircle,
  MessageSquareWarning,
  Play,
  Trash2,
  Video,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import moment from "moment";
// import { v4 as uuidv4 } from "uuid";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Interview,
  ThesisInterview,
  LiveInterview,
  MockInterview,
} from "@/utils/schema";
import { db } from "@/utils/db";
import { DocumentUpload } from "@/components/ui/file";
import { generateChatResponse } from "@/utils/ChatGPTAIModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ThesisPage = () => {
  const { user } = useUser();
  const [thesisInterviews, setThesisInterviews] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0); // zero-based
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddInterviewDialogOpen, setIsAddInterviewDialogOpen] =
    useState(false);

  const [domain, setDomain] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  let email;

  const onStart = (id) => {
    router.push(`/dashboard/interview/thesis/${id}/start`);
  };

  const onFeedbackPress = (id) => {
    router.push(`/dashboard/interview/thesis/${id}/feedback`);
  };

  const onLive = (id) => {
    router.push(`/dashboard/interview/thesis/${id}/live`);
  };

  const getThesisInterviews = async (page = 0, size = 10) => {
    const email = user?.primaryEmailAddress?.emailAddress;

    try {
      const res = await fetch("/api/fetchThesisInterviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createdBy: email,
          page,
          size,
        }),
      });

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to fetch thesis interview data"
        );
      }

      const data = await res.json();

      setTotalCount(data.thesisInterviews.length);
      setThesisInterviews(data.thesisInterviews);
    } catch (err) {
      console.error("Error fetching thesis interviews:", err);
      toast.error(err.message || "Failed to fetch thesis interviews");
    }
  };

  const handleAddThesisInterview = async (e) => {
    e.preventDefault();
    setLoading(true);

    let inputPrompt = `Thesis domain: ${domain}.

    The resume content is:
    ${resumeContent}`;

    let qna = [];
    if (!isLive) {
      inputPrompt += `

    Generate ${numberOfQuestions} interview questions and answers in JSON format below without backslashes on ":
    {qna: [{ question: "question 1 here", answer: "answer 1 here" }, { question: "question 2 here", answer: "answer 2 here" }]}`;

      try {
        const responseText = await generateChatResponse(inputPrompt);
        const cleanedResponse = responseText
          .replace(/```json\n?|```/g, "")
          .trim();
        qna = await JSON.parse(cleanedResponse);
      } catch (error) {
        console.error("Error generating questions and answers:", error);
        toast.error("Failed to generate the questions and answers.");
      } finally {
        setLoading(false);
      }
    }

    let id = 1;
    try {
      const res = await db
        .insert(Interview)
        .values({
          title: domain,
          type: isLive ? 1 : 0,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY HH:mm"),
          // mockId: uuidv4(),
        })
        .returning({ id: Interview.id });

      id = res[0].id;
    } catch (error) {
      console.error("Error adding interview:", error);
      toast.error("Failed to add interview.");
    } finally {
      setLoading(false);
    }

    try {
      if (isLive) {
        await db.insert(LiveInterview).values({
          type: 1,

          interviewId: id,
        });
      } else {
        await db.insert(MockInterview).values({
          qna: qna,
          type: 1,

          interviewId: id,
        });
      }
    } catch (error) {
      console.error("Error adding live interview:", error);
      toast.error("Failed to add live interview.");
    } finally {
      setLoading(false);
    }

    try {
      await db.insert(ThesisInterview).values({
        domain,
        resumeContent,

        interviewId: id,
      });

      setIsAddInterviewDialogOpen(false);
      const baseUrl = `/dashboard/interview/thesis/${id}`;
      if (isLive) {
        toast.success("We are ready to help you!");
        router.push(`${baseUrl}/live`);
      } else {
        toast.success("Interview questions generated successfully!");
        router.push(`${baseUrl}/start`);
      }
    } catch (error) {
      console.error("Error adding thesis interview:", error);
      toast.error("Failed to add thesis interview.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await fetch("/api/deleteInterview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!res) {
        throw new Error(res.message || "Failed to delete the thesis interview");
      }

      // Close dialog and show success toast
      setIsDeleteDialogOpen(false);
      toast.success(res.message);

      // Use router to refresh instead of full page reload
      //   router.refresh();
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview");
    }
  };

  useEffect(() => {
    email = user?.primaryEmailAddress?.emailAddress;

    if (email) {
      getThesisInterviews(pageIndex, pageSize);
    }
  }, [user, pageIndex, pageSize]);

  const columns = useMemo(
    () => [
      {
        header: "S.No",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Domain",
        accessorKey: "domain",
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
      },
      {
        header: "Method",
        accessorKey: "type",
        cell: (info) =>
          info.cell.row.original?.type === 0 ? (
            <span className="text-secondaryColor font-medium">Mock</span>
          ) : (
            <span className="text-primaryColor-level1 font-medium">Live</span>
          ),
      },
      {
        header: "Action",
        cell: (info) => (
          <div className="flex gap-2 justify-center">
            {info.cell.row.original?.type === 0 ? (
              info.cell.row.original?.submitted ? (
                <Button
                  size="sm"
                  variant="muted"
                  onClick={() => onFeedbackPress(info.cell.row.original?.id)}
                  className="mr-2 text-secondaryColor hover:text-secondaryColor/80 !p-0"
                  title="Feedback"
                >
                  <MessageSquareWarning />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="muted"
                  onClick={() => onStart(info.cell.row.original?.id)}
                  title="Start"
                  className="mr-2 text-secondaryColor hover:text-secondaryColor/80 !p-0"
                >
                  <Play />
                </Button>
              )
            ) : (
              <Button
                size="sm"
                variant="muted"
                onClick={() => onLive(info.cell.row.original?.id)}
                title="Live Help"
                className="mr-2 text-primaryColor-level1 hover:text-primaryColor-level1/80 !p-0"
              >
                <Video />
              </Button>
            )}

            <Button
              size="sm"
              variant="muted"
              onClick={() => setIsDeleteDialogOpen(true)}
              title="Delete"
              className="text-red-600 hover:text-red-500 !p-0"
            >
              <Trash2 />
            </Button>

            {isDeleteDialogOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                  <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                  <p className="mb-4">
                    Are you sure you want to delete this interview?
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(info.cell.row.original?.id)}
                    >
                      Confirm Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: thesisInterviews,
    columns,
    manualPagination: true, // 👈 Manual mode
    pageCount: Math.ceil(totalCount / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      globalFilter,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex gap-3 items-center mb-4">
        <ArrowLeft
          className="bg-primaryColor text-white p-1 rounded-full cursor-pointer"
          size={25}
          onClick={() => router.back()}
        />
        <span className="font-medium">Dashboard</span>
        <span className="text-primaryColor-level2">/ Thesis Interview</span>
        <Button
          size="sm"
          className="ml-auto bg-primaryColor hover:bg-primaryColor-level1"
          onClick={() => setIsAddInterviewDialogOpen(true)}
        >
          + Add New
        </Button>
      </div>

      <Dialog
        open={isAddInterviewDialogOpen}
        onOpenChange={setIsAddInterviewDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Create Your Thesis Interview
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="w-full">
              <div className="relative right-0">
                <ul
                  className="relative flex flex-wrap px-1.5 py-1.5 list-none rounded-md bg-slate-100"
                  data-tabs="tabs"
                  role="list"
                >
                  <li
                    className="z-30 flex-auto text-center"
                    onClick={() => {
                      setIsLive(false);
                    }}
                  >
                    <a
                      className={`${
                        isLive
                          ? "text-primaryColor"
                          : "bg-primaryColor text-white"
                      } z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer bg-inherit`}
                      data-tab-target=""
                      role="tab"
                      aria-selected="true"
                    >
                      Mock
                    </a>
                  </li>
                  <li
                    className="z-30 flex-auto text-center"
                    onClick={() => {
                      setIsLive(true);
                    }}
                  >
                    <a
                      className={`${
                        isLive
                          ? "bg-primaryColor text-white"
                          : "text-primaryColor"
                      } z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer bg-inherit`}
                      data-tab-target=""
                      role="tab"
                      aria-selected="false"
                    >
                      Live
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <form onSubmit={handleAddThesisInterview}>
              <div className="my-3">
                <label className="flex">
                  Domain
                  <Asterisk className="text-red-600" size={15} />
                </label>
                <Input
                  placeholder="Ex. Full Stack Developer"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>

              <div className="my-3">
                <label className="flex">
                  Upload resume (Max size: 5 MB)
                  <Asterisk size={15} className="text-red-600" />
                </label>
                <DocumentUpload
                  fileText={resumeContent}
                  setFileText={setResumeContent}
                  MAX_FILE_SIZE_MB={5}
                />
              </div>

              {!isLive && (
                <div className="my-3 w-full">
                  <label className="flex">
                    Number of Questions
                    <Asterisk size={15} className="text-red-600" />
                  </label>
                  <Input
                    type="number"
                    value={numberOfQuestions}
                    placeholder="Enter number of questions"
                    onChange={(e) => setNumberOfQuestions(e.target.value)}
                  />
                </div>
              )}

              <div className="my-3 hidden">
                <label>
                  Number of Questions
                  <Asterisk size={15} className="text-red-600" />
                </label>
                <Input type="number" />
              </div>

              <div className="flex gap-5 justify-end mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-primaryColor"
                  onClick={() => setIsAddInterviewDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primaryColor hover:bg-primaryColor-level1"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2" />{" "}
                      {isLive ? "Helping" : "Generating"}
                    </>
                  ) : isLive ? (
                    "Get Live Help"
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <div className="border-2 rounded-lg p-5">
        <div className="flex justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Thesis Interview List
          </h2>

          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <table className="min-w-full border">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left border">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
          </div>
          <span>
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span>
            Go to page:{" "}
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border rounded w-16 px-2 py-1"
            />
          </span>
        </div>
      </div>
    </>
  );
};

export default ThesisPage;
