import MainLayout from "@/components/layout/main-layout";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    redirect("/sign-in");
  }

  const user = await db.user.findFirst({
    where: {
      clerkUserId,
    },
  });

  if (user) {
    redirect(`/dashboard`);
  }

  return <MainLayout>{children}</MainLayout>;
}
