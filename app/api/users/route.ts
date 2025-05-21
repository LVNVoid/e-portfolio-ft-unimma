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

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!gender) {
      return new NextResponse("Gender is required", { status: 400 });
    }

    if (!address) {
      return new NextResponse("Address is required", { status: 400 });
    }

    if (!studyProgram) {
      return new NextResponse("Study Program is required", { status: 400 });
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
