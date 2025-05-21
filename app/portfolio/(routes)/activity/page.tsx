import { Suspense } from "react";
import { getPortfolios } from "../../_lib/data";
import { DataTable } from "../../_components/data-table";
import { columns } from "../../_components/columns";

export default async function ActivityPortfolioPage() {
  const activities = await getPortfolios("kegiatan");

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
