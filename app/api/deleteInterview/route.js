import { NextResponse } from "next/server";
import { db } from "../../../utils/db";
import { eq } from "drizzle-orm";
import { Interview } from "../../../utils/schema";

export async function POST(request) {
  try {
    const { id } = await request.json();

    await db.update(Interview).set({ status: 0 }).where(eq(Interview.id, id));

    return NextResponse.json(
      {
        message: "Interview deleted successfully",
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
