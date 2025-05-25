import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  gender: z.enum(["pria", "wanita"]),
  address: z.string().optional(),
  studyProgram: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;

    const body = await req.json();

    const parsedData = updateProfileSchema.parse(body);

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: parsedData,
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
