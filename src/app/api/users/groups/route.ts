import { connectToDatabase } from "@/lib/database";
import { User } from "@/lib/schemas/user.schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const groups = await User.distinct("group", {
      group: { $nin: [null, ""] },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
