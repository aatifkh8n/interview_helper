"use client";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
<<<<<<< HEAD
import { and, desc, eq, inArray } from "drizzle-orm";
=======
import { desc, eq } from "drizzle-orm";
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
import React, { useEffect, useState } from "react";
import InterviewItem from "./InterviewItem";
import LiveHelpInterviewItem from "./LiveHelpInterviewItem";

<<<<<<< HEAD
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
=======
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
      .orderBy(desc(MockInterview.id));

    setInterviewList(result);

    result = await db
      .select()
      .from(LiveHelpInterview)
      .where(
        eq(LiveHelpInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      ) /* .where(
      eq(LiveHelpInterview.type, type)
      ) */
      .orderBy(desc(LiveHelpInterview.id));

    setLiveHelpInterviewList(result);
  };

  useEffect(() => {
    user && GetInterviewList();
  }, [user, interviewList]);
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd

  return (
    <>
      <div className="mt-6">
        {/* <h2 className="font-medium text-xl">{heading}</h2> */}
<<<<<<< HEAD
        <div className="relative overflow-x-auto shadow-md">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  S.No
                </th>
                <th scope="col" className="px-6 py-3">
                  Title
=======
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Job Position
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
                </th>
                <th scope="col" className="px-6 py-3">
                  Experience
                </th>
                <th scope="col" className="px-6 py-3">
<<<<<<< HEAD
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Interview Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Method
=======
                  Created at
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
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
<<<<<<< HEAD
                    getInterviewList={getInterviewList}
=======
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
                    key={index}
                    index={index + 1}
                  />
                ))
              ) : (
                <tr>
<<<<<<< HEAD
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
=======
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
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
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
