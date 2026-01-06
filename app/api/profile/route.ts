import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
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

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}

export async function PUT(request: NextRequest) {
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

  const { name, bio } = body as { name?: string; bio?: string };

  if (name !== undefined && name.trim().length < 2) {
    return NextResponse.json(
      { message: "Name too short" },
      { status: 400 }
    );
  }

  if (bio !== undefined && bio.length > 240) {
    return NextResponse.json(
      { message: "Bio too long" },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name.trim();
  if (bio !== undefined) updates.bio = bio;

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    select: "-password",
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}


