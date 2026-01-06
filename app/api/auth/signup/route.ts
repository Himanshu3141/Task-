import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { setAuthCookie, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await connectDB();

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { name, email, password } = body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { message: "Name is required" },
      { status: 400 }
    );
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { message: "Valid email required" },
      { status: 400 }
    );
  }

  if (!password || password.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email,
    password: hashed,
  });

  const token = signToken(user._id.toString());
  const response = NextResponse.json(
    {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        bio: user.bio,
      },
      token,
    },
    { status: 201 }
  );
  return setAuthCookie(response, token);
}


