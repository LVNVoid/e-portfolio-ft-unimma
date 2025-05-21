import { Suspense } from "react";
import { getPortfolios } from "../_lib/data";
import { columns } from "../_components/columns";
import { DataTable } from "../_components/data-table";

export default async function PortfolioPage() {
  const portfolios = await getPortfolios();

  return (
    <div className="container mx-auto">
      {/* <h1 className="text-2xl font-bold mb-6">Portofolio Mahasiswa</h1> */}
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
