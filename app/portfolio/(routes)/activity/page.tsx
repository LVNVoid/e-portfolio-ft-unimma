import { Suspense } from "react";
import { db } from "@/lib/db";
import { DataTable } from "../../_components/data-table";
import { columns } from "../../_components/columns";

export default async function ActivityPortfolioPage() {
  const activities = await db.portfolio.findMany({
    where: {
      category: "kegiatan",
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
          data={activities}
          title="Portofolio Kegiatan Mahasiswa"
        />
      </Suspense>
    </div>
  );
}
