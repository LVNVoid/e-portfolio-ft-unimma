import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const updateProfileSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  gender: z.enum(["pria", "wanita"]),
  address: z.string().optional(),
  studyProgram: z.string().optional(),
  profilePicture: z.string().optional(),
  removeProfilePicture: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;

    const body = await req.json();
    const parsedData = updateProfileSchema.parse(body);

    // Get current user data to check existing profile picture
    const currentUser = await db.user.findUnique({
      where: { id: userId },
      select: { profilePicture: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    let updateData = { ...parsedData };
    delete updateData.removeProfilePicture;

    // Handle profile picture removal
    if (parsedData.removeProfilePicture && currentUser.profilePicture) {
      // Delete old file if it exists
      if (currentUser.profilePicture.startsWith("/uploads/")) {
        const oldFilePath = path.join(
          process.cwd(),
          "public",
          currentUser.profilePicture
        );

        if (existsSync(oldFilePath)) {
          try {
            await unlink(oldFilePath);
          } catch (error) {
            console.error("Error deleting old profile picture:", error);
          }
        }
      }

      updateData.profilePicture = "";
    }

    // Handle profile picture update (delete old file if new one is uploaded)
    if (
      parsedData.profilePicture &&
      parsedData.profilePicture !== currentUser.profilePicture &&
      currentUser.profilePicture &&
      currentUser.profilePicture.startsWith("/uploads/")
    ) {
      const oldFilePath = path.join(
        process.cwd(),
        "public",
        currentUser.profilePicture
      );

      if (existsSync(oldFilePath)) {
        try {
          await unlink(oldFilePath);
        } catch (error) {
          console.error("Error deleting old profile picture:", error);
        }
      }
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan saat memperbarui profil" },
      { status: 500 }
    );
  }
}
