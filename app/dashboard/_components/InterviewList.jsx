"use client";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, inArray } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewItem from "./InterviewItem";
import LiveHelpInterviewItem from "./LiveHelpInterviewItem";

import { LiveInterview, Interview, MockInterview } from "@/utils/schema";
import { toast } from "sonner";
import Link from "next/link";

const InterviewList = ({ interviews }) => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [isInterviewChanged, setIsInterviewChanged] = useState(false);
  const [liveHelpInterviewList, setLiveHelpInterviewList] = useState([]);

  const getInterviewList = async () => {
    let result = [];

    try {
      result = await db
        .select({
          ...MockInterview,
          ...Interview,
          subInterviewType: MockInterview.type,
        })
        .from(Interview)
        .innerJoin(MockInterview, eq(Interview.id, MockInterview.interviewId))
        .where(
          and(
            eq(Interview.createdBy, user?.primaryEmailAddress?.emailAddress),
            eq(Interview.status, 1)
          )
        )
        .orderBy(desc(Interview.createdAt));
    } catch (err) {
      toast.error("Error fetching the interviews");
    }

    let combinedInterviews = [...result];

    try {
      result = await db
        .select({
          ...LiveInterview,
          ...Interview,
          subInterviewType: LiveInterview.type,
        })
        .from(Interview)
        .innerJoin(LiveInterview, eq(Interview.id, LiveInterview.interviewId))
        .where(
          and(
            eq(Interview.createdBy, user?.primaryEmailAddress?.emailAddress),
            eq(Interview.status, 1)
          )
        )
        .orderBy(desc(Interview.createdAt));
    } catch (err) {
      toast.error("Error fetching the interviews");
    }

    combinedInterviews = [...combinedInterviews, ...result];
    setInterviewList(combinedInterviews);
  };

  useEffect(() => {
    user && getInterviewList();
  }, [user]);

  useEffect(() => {
    getInterviewList();
  }, []);

  return (
    <>
      <div className="mt-6">
        {/* <h2 className="font-medium text-xl">{heading}</h2> */}
        <div className="relative overflow-x-auto shadow-md">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  S.No
                </th>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Experience
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Interview Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {interviewList.length > 0 ? (
                interviewList.map((interview, index) => (
                  <InterviewItem
                    interview={interview}
                    getInterviewList={getInterviewList}
                    key={index}
                    index={index + 1}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-gray-400">
                    <img
                      src="/images/interviews/empty.svg"
                      alt="empty"
                      className="mx-auto "
                    />
                    Seems you have not added any interview yet.{" "}
                    <Link href="#addInterview" className="text-primaryColor">
                      Add new
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3"></div>
      </div>
    </>
  );
};

export default InterviewList;
