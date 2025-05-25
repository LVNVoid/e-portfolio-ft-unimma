import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const DashboardPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">👋🏻 Selamat datang {user.name}</p>
      </div>
    </div>
  );
};

export default DashboardPage;
