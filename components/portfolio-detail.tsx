"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Award,
  FileText,
  Download,
  ArrowLeft,
  Eye,
  ExternalLink,
  Clock,
  Share2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";

// Types
interface PortfolioDetailProps {
  id: string;
  title: string;
  description: string;
  level: "internasional" | "nasional" | "regional" | "universitas";
  category: "prestasi" | "kegiatan";
  docsUrl: string;
  user: {
    name: string | null;
    email: string;
    studyProgram: string | null;
    profilePicture: string | null;
  };
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface TimelineItemProps {
  color: string;
  title: string;
  date: string;
  description: string;
}

interface PortfolioDetailComponentProps {
  portfolio: PortfolioDetailProps;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PortfolioDetail: React.FC<PortfolioDetailComponentProps> = ({
  portfolio,
}) => {
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);
  const [pdfZoom, setPdfZoom] = useState<number>(100);

  const handleDownload = (): void => {
    if (!portfolio.docsUrl) return;

    const link = document.createElement("a");
    link.href = portfolio.docsUrl;
    link.download = `${portfolio.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (): Promise<void> => {
    const shareData = {
      title: portfolio.title,
      text: `Lihat portfolio: ${portfolio.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // You might want to show a toast notification here
        alert("Link berhasil disalin ke clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container w-full">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Portfolio
          </Link>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 p-8 mb-8 border">
            <div className="absolute inset-0 bg-grid-primary/[0.02] dark:bg-grid-primary/[0.05] bg-[size:20px_20px]" />
            <div className="relative">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex space-x-4">
                    <Avatar className="w-16 h-16 mb-4">
                      <AvatarImage
                        src={portfolio.user.profilePicture ?? undefined}
                        alt={portfolio.user.name || undefined}
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <h2 className="text-foreground">{portfolio.user.name}</h2>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {portfolio.user.email}
                      </div>
                    </div>
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                    {portfolio.title}
                  </h1>

                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-3xl">
                    {portfolio.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(portfolio.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {portfolio.level.charAt(0).toUpperCase() +
                        portfolio.level.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {portfolio.docsUrl && (
                    <Button
                      onClick={() => setShowPdfPreview(true)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview PDF
                    </Button>
                  )}
                  {portfolio.docsUrl && (
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    title="Bagikan"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* PDF Preview Card */}
            {portfolio.docsUrl && (
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Preview Dokumen
                    </div>
                    {showPdfPreview && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPdfZoom(Math.max(50, pdfZoom - 10))}
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground min-w-[50px] text-center">
                          {pdfZoom}%
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPdfZoom(Math.min(200, pdfZoom + 10))
                          }
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {showPdfPreview ? (
                    <div className="relative">
                      <iframe
                        src={`${portfolio.docsUrl}#zoom=${pdfZoom}`}
                        className="w-full h-[600px] border-0"
                        title="PDF Preview"
                      />
                      <div className="absolute bottom-4 right-4 flex gap-2 bg-background/80 p-2 rounded-md text-foreground">
                        <Button
                          size="sm"
                          onClick={handleDownload}
                          className="bg-background text-foreground hover:bg-background/90"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(portfolio.docsUrl, "_blank")
                          }
                          className="bg-background hover:bg-background/90"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Buka
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Dokumen PDF Tersedia
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Klik tombol preview untuk melihat dokumen atau download
                        untuk menyimpan ke perangkat Anda
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          onClick={() => setShowPdfPreview(true)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Preview Dokumen
                        </Button>
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Timeline Card */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <TimelineItem
                    color="bg-blue-500"
                    title="Dibuat"
                    date={portfolio.createdAt}
                    description="Portfolio pertama kali ditambahkan"
                  />
                  <TimelineItem
                    color="bg-green-500"
                    title="Terakhir Diperbarui"
                    date={portfolio.updatedAt}
                    description="Pembaruan terakhir dilakukan"
                  />
                  <TimelineItem
                    color="bg-purple-500"
                    title="Tanggal Prestasi"
                    date={portfolio.date}
                    description="Prestasi dicapai pada tanggal ini"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem: React.FC<TimelineItemProps> = ({
  color,
  title,
  date,
  description,
}) => (
  <div className="flex items-start gap-4">
    <div className="relative">
      <div className={`w-3 h-3 rounded-full ${color} mt-2 flex-shrink-0`} />
      <div className="absolute top-5 left-1/2 w-px h-6 bg-border transform -translate-x-1/2 last:hidden" />
    </div>
    <div className="flex-1 pb-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <p className="text-xs text-muted-foreground mb-1">
        {new Date(date).toLocaleDateString("id-ID", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default PortfolioDetail;
