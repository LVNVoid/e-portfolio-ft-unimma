import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, MapPin, Calendar, BookOpen, Shield } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProfilePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const profileData = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!profileData) {
    return <div>Profil tidak ditemukan</div>;
  }

  const getInitials = (name: string | null) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      case "dosen":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "mahasiswa":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  return (
    <div className="container mx-auto bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Kelola informasi profil Anda</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 border-4 border-border">
                  <AvatarImage
                    src={profileData.profilePicture ?? ""}
                    alt={profileData.name ?? "Profile"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    {getInitials(profileData.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  {profileData.name ?? "Tidak diketahui"}
                </CardTitle>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  <Badge className={getRoleBadgeColor(profileData.role)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {profileData.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                Informasi Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Nama Lengkap
                  </label>
                  <p className="text-foreground font-medium">
                    {profileData.name ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Jenis Kelamin
                  </label>
                  <p className="text-foreground font-medium">
                    {profileData.gender}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Email
                </label>
                <p className="text-foreground font-medium break-all">
                  {profileData.email}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Alamat
                </label>
                <p className="text-foreground font-medium leading-relaxed">
                  {profileData.address ?? "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                Informasi Akademik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Role
                </label>
                <Badge
                  className={
                    getRoleBadgeColor(profileData.role) + " text-sm px-3 py-1"
                  }
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {profileData.role}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Program Studi
                </label>
                <p className="text-foreground font-medium">
                  {profileData.studyProgram ?? "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Tanggal Pembuatan Akun
                </label>
                <p className="text-foreground font-medium">
                  {profileData.createdAt.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <Button>
            <Link href={`/profile/${profileData.id}/edit`}>Ubah Profil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
