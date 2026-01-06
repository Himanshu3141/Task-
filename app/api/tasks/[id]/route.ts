import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Task } from "@/lib/models/task";
import { getUserIdFromRequest } from "@/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: NextRequest, { params }: Params) {
  await connectDB();

  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid task id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { title, description, status } = body as {
    title?: string;
    description?: string;
    status?: string;
  };

  const updates: Record<string, unknown> = {};
  if (title !== undefined) {
    if (!title.trim()) {
      return NextResponse.json(
        { message: "Title cannot be empty" },
        { status: 400 }
      );
    }
    updates.title = title.trim();
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (status !== undefined) {
    if (!["todo", "in-progress", "done"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }
    updates.status = status;
  }

  const task = await Task.findOneAndUpdate(
    { _id: id, userId },
    updates,
    { new: true }
  );

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  await connectDB();

  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid task id" }, { status: 400 });
  }

  const task = await Task.findOneAndDelete({ _id: id, userId });

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Task deleted" });
}


