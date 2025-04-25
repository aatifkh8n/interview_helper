import { NextResponse } from "next/server";
import { db } from "../../../utils/db";
import { and, desc, eq } from "drizzle-orm";
import { Interview, EducationalInterview, MockInterview } from "../../../utils/schema";

export async function POST(request) {
  try {
    const { createdBy, page, size } = await request.json();

    // Paginated query
    const result = await db
      .select({
        ...EducationalInterview,
        ...MockInterview,
        ...Interview,
      })
      .from(Interview)
      .innerJoin(EducationalInterview, eq(Interview.id, EducationalInterview.interviewId))
      .leftJoin(MockInterview, and(
        eq(Interview.id, MockInterview.interviewId),
        eq(Interview.type, 0)
      ))
      .where(and(eq(Interview.createdBy, createdBy), eq(Interview.status, 1)))
      .orderBy(desc(Interview.createdAt))
      .limit(size)
      .offset(page * size); // 👈 important for pagination

    return NextResponse.json(
      {
        educationalInterviews: result.length > 0 ? result : [],
        message: "Educational interviews fetched successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
