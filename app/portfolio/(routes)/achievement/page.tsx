import { Suspense } from "react";
import { DataTable } from "../../_components/data-table";
import { columns } from "../../_components/columns";
import { getPortfolios } from "../../_lib/data";

export default async function AchievementPortfolioPage() {
  const achievements = await getPortfolios("prestasi");

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
