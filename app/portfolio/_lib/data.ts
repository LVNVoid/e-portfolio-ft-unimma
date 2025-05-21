import { db } from "@/lib/db";

export async function getPortfolios() {
  await db.portfolio.findMany({
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
}
