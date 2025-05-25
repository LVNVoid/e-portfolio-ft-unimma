import PortfolioDetail from "@/components/portfolio-detail";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface DetailPortfolioPageProps {
  params: { portfolioId: string };
}

type Portfolio = {
  id: string;
  title: string;
  level: "internasional" | "nasional" | "regional" | "universitas";
  category: "prestasi" | "kegiatan";
  docsUrl: string | null;
  date: Date;
  user: {
    name: string | null;
    email: string;
    studyProgram: string | null;
    profilePicture: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

const formatPortfolioForDetail = (portfolio: Portfolio) => ({
  id: portfolio.id,
  title: portfolio.title,
  level: portfolio.level,
  category: portfolio.category,
  docsUrl: portfolio.docsUrl ?? "",
  date: portfolio.date.toISOString(),
  createdAt: portfolio.createdAt.toISOString(),
  updatedAt: portfolio.updatedAt.toISOString(),
  userId: portfolio.userId,
  user: portfolio.user,
});

const DetailPortfolioPage = async ({ params }: DetailPortfolioPageProps) => {
  const { portfolioId } = await params;

  const portfolio = await db.portfolio.findUnique({
    where: { id: portfolioId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          studyProgram: true,
          profilePicture: true,
        },
      },
    },
  });

  if (!portfolio) {
    return notFound();
  }

  const formattedPortfolio = formatPortfolioForDetail(portfolio);
  if (!formattedPortfolio.user) {
    return <div>Error: User data not found</div>;
  }

  return (
    <Suspense fallback={<div>Loading portfolio details...</div>}>
      <PortfolioDetail portfolio={formattedPortfolio} />
    </Suspense>
  );
};

export default DetailPortfolioPage;
