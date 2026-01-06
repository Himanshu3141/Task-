import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Task } from "@/lib/models/task";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  await connectDB();

  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const status = searchParams.get("status");

  const filters: Record<string, unknown> = { userId };

  if (status && ["todo", "in-progress", "done"].includes(status)) {
    filters.status = status;
  }

  if (q) {
    filters.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  const tasks = await Task.find(filters).sort({ createdAt: -1 });

  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  await connectDB();

  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { title, description = "", status = "todo" } = body as {
    title?: string;
    description?: string;
    status?: string;
  };

  if (!title || !title.trim()) {
    return NextResponse.json(
      { message: "Title is required" },
      { status: 400 }
    );
  }

  if (!["todo", "in-progress", "done"].includes(status)) {
    return NextResponse.json(
      { message: "Invalid status" },
      { status: 400 }
    );
  }

  const task = await Task.create({
    userId,
    title: title.trim(),
    description: description ?? "",
    status,
  });

  return NextResponse.json({ task }, { status: 201 });
}


