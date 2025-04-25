import { NextResponse } from "next/server";
import { db } from "../../../utils/db";
import { and, eq } from "drizzle-orm";
import { Interview } from "../../../utils/schema";

export async function POST(request) {
  try {
    const { createdBy } = await request.json();

    const result = await db
      .select()
      .from(Interview)
      .where(and(eq(Interview.createdBy, createdBy), eq(Interview.status, 1)));

    return NextResponse.json(
      {
        interviews: result.length > 0 ? result : [],
        message: "Interviews fetched successfully",
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
