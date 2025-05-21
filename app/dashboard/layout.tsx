import MainLayout from "@/components/layout/main-layout";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.user.findFirst({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <>
      <MainLayout>{children}</MainLayout>
    </>
  );
}
