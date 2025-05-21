import { Suspense } from "react";
import { DataTable } from "../../_components/data-table";
import { columns } from "../../_components/columns";
import { db } from "@/lib/db";

export default async function AchievementPortfolioPage() {
  const achievements = await db.portfolio.findMany({
    where: {
      category: "prestasi",
    },
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

  return (
    <div className="container mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable
          columns={columns}
          data={achievements}
          title="Portofolio Prestasi Mahasiswa"
        />
      </Suspense>
    </div>
  );
}
