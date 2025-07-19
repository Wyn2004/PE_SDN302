import { connectToDatabase } from "@/lib/database";
import { User } from "@/lib/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "asc";

    let query = {};

    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }

    const sortOrder = sort === "desc" ? -1 : 1;

    const response = await User.find(query)
      .sort({ createdAt: sortOrder })
      .exec();

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User email already exists" },
        { status: 400 }
      );
    }

    const user = await User.create(body);
    await user.save();

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
