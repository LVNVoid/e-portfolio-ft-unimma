import { PortfolioForm } from "@/components/portfolio-form";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AddPortfolioPage() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    redirect("/sign-in");
  }

  // Get internal user ID from Clerk user ID
  const user = await db.user.findUnique({
    where: { clerkUserId },
    select: { id: true },
  });

  if (!user) {
    redirect("/portfolio");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Portfolio Baru</h1>
        <p className="text-muted-foreground">
          Isi form berikut untuk menambahkan portfolio baru
        </p>
      </div>
      <PortfolioForm userId={user.id} />
    </div>
  );
}
