import { EditProfileForm } from "@/components/edit-profile-form";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface EditProfilePageProps {
  params: {
    userId: string;
  };
}

export default async function EditProfilePage({
  params,
}: EditProfilePageProps) {
  const { userId } = await params;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      gender: true,
      address: true,
      studyProgram: true,
      profilePicture: true,
    },
  });

  if (!user) return notFound();

  const defaultValues = {
    name: user.name || "",
    email: user.email,
    gender: user.gender as "pria" | "wanita",
    address: user.address || "",
    studyProgram: user.studyProgram || "",
    profilePicture: user.profilePicture || "",
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Profil</h1>
        <p className="text-muted-foreground mt-2">
          Perbarui informasi profil Anda di bawah ini
        </p>
      </div>

      <EditProfileForm userId={userId} defaultValues={defaultValues} />
    </div>
  );
}
