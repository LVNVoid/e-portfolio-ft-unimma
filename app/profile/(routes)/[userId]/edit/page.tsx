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
  });

  if (!user) return notFound();

  const defaultValues = {
    name: user.name || "",
    email: user.email,
    gender: user.gender,
    address: user.address || "",
    studyProgram: user.studyProgram || "",
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profil</h1>
      <EditProfileForm userId={userId} defaultValues={defaultValues} />
    </div>
  );
}
