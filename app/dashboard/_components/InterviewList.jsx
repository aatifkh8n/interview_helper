"use client";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewItem from "./InterviewItem";
import LiveHelpInterviewItem from "./LiveHelpInterviewItem";

import { LiveHelpInterview, MockInterview } from "@/utils/schema";

const InterviewList = ({ type, heading }) => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [liveHelpInterviewList, setLiveHelpInterviewList] = useState([]);

  const GetInterviewList = async () => {
    let result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      ) /* .where(
      eq(MockInterview.type, type)
      ) */
      .orderBy(desc(MockInterview.id))
      .execute();

    setInterviewList(result);

    result = await db
      .select()
      .from(LiveHelpInterview)
      .where(
        eq(LiveHelpInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      ) /* .where(
      eq(LiveHelpInterview.type, type)
      ) */
      .orderBy(desc(LiveHelpInterview.id))
      .execute();

    setLiveHelpInterviewList(result);
  };

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  return (
    <>
      <div className="mt-6">
        {/* <h2 className="font-medium text-xl">{heading}</h2> */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Job Position
                </th>
                <th scope="col" className="px-6 py-3">
                  Experience
                </th>
                <th scope="col" className="px-6 py-3">
                  Created at
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
                    key={index}
                    index={index + 1}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-gray-400">
                    No interviews to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3"></div>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
        Live Help Interviews
        {/* <Button
            size="sm"
            variant="outline"
            className="ml-2"
            >
            View all
          </Button> */}
      </h2>
      <div className="mt-6">
        {/* <h2 className="font-medium text-xl">{heading}</h2> */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Job Position
                </th>
                <th scope="col" className="px-6 py-3">
                  Experience
                </th>
                <th scope="col" className="px-6 py-3">
                  Created at
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {liveHelpInterviewList.length > 0 ? (
                liveHelpInterviewList.map((interview, index) => (
                  <LiveHelpInterviewItem
                    interview={interview}
                    key={index}
                    index={index + 1}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-gray-400">
                    No interviews to display
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
