import { Suspense } from "react";
import { columns } from "../_components/columns";
import { DataTable } from "../_components/data-table";
import { db } from "@/lib/db";

export default async function PortfolioPage() {
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

  return (
    <div className="container mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable
          columns={columns}
          data={portfolios}
          title="Semua Portofolio"
        />
      </Suspense>
    </div>
  );
}
