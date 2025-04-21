import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const response = await fetch("http://localhost:8000/process-file/", {
      method: "POST",
      headers: {
        ...req.headers,
      },
      body: req,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
