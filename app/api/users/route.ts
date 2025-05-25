import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, gender, address, studyProgram, profilePicture } = body;

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0].emailAddress;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validasi field yang required
    const requiredFields = [
      { field: name, message: "Name is required" },
      { field: gender, message: "Gender is required" },
      { field: address, message: "Address is required" },
      { field: studyProgram, message: "Study Program is required" },
    ];

    for (const { field, message } of requiredFields) {
      if (!field) {
        return new NextResponse(message, { status: 400 });
      }
    }

    // Cek apakah user sudah ada
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 409 });
    }

    const user = await db.user.create({
      data: {
        clerkUserId: userId,
        email: email ?? "",
        name,
        gender,
        address,
        studyProgram,
        profilePicture: profilePicture ?? "",
        role: "mahasiswa",
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
