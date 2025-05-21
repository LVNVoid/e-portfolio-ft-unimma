import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Dapatkan userId dari Clerk
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, level, category, docsUrl } = body;

    if (!title || !level || !category) {
      return NextResponse.json(
        { error: "Title, level, and category are required" },
        { status: 400 }
      );
    }

    // Cari user di database berdasarkan clerkUserId
    const user = await db.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Buat portfolio dengan userId dari database
    const newPortfolio = await db.portfolio.create({
      data: {
        title,
        level,
        category,
        date: new Date(),
        docsUrl,
        userId: user.id, // Gunakan id dari database, bukan clerkUserId
      },
    });

    return NextResponse.json(newPortfolio, { status: 201 });
  } catch (error) {
    console.error("[PORTFOLIOS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function GET() {
  try {
    const portfolios = await db.portfolio.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studyProgram: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
