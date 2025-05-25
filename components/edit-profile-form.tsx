"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const editProfileSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  gender: z.enum(["pria", "wanita"]),
  address: z.string().optional(),
  studyProgram: z.string().optional(),
  profilePicture: z.string().optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  userId: string;
  defaultValues: EditProfileFormValues;
}

export function EditProfileForm({
  userId,
  defaultValues,
}: EditProfileFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    defaultValues.profilePicture || ""
  );
  const [isRemoving, setIsRemoving] = useState(false);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Hanya file JPEG, PNG, dan WebP yang diizinkan");
      return;
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);

    try {
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        form.setValue("profilePicture", response.data.url);
        toast.success("Foto profil berhasil diupload");
      } else {
        throw new Error("Upload gagal");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengupload foto. Silakan coba lagi.");
      setImagePreview(defaultValues.profilePicture || "");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    setIsRemoving(true);

    try {
      // Call API to remove profile picture
      await axios.put(`/api/users/${userId}`, {
        ...form.getValues(),
        removeProfilePicture: true,
      });

      setImagePreview("");
      form.setValue("profilePicture", "");
      toast.success("Foto profil berhasil dihapus");
      router.refresh();
    } catch (error) {
      console.error("Remove image error:", error);
      toast.error("Gagal menghapus foto profil");
    } finally {
      setIsRemoving(false);
    }
  };

  async function onSubmit(values: EditProfileFormValues) {
    try {
      await axios.put(`/api/users/${userId}`, values);
      toast.success("Profil berhasil diperbarui");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui profil");
      console.error("Update profile error:", error);
    }
  }

  return (
    <div className="w-full max-w-5xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Profile Picture Section */}
          <div className="col-span-1 flex flex-col items-center text-center p-6 border rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Foto Profil</h3>

            <div className="relative mb-4">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={imagePreview}
                  alt="Profile picture"
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl">
                  <Camera className="w-8 h-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>

              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                  className="hidden"
                  id="profile-picture-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="profile-picture-upload"
                  className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      {imagePreview ? "Ganti Foto" : "Upload Foto"}
                    </>
                  )}
                </label>
              </div>

              {imagePreview && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Menghapus...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus Foto
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Foto Profil</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus foto profil? Tindakan
                        ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRemoveImage}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              JPG, PNG, atau WebP. Maksimal 5MB.
            </p>
          </div>

          {/* Form Section */}
          <div className="col-span-1 md:col-span-2 space-y-6 bg-background p-6 rounded-xl shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama lengkap Anda"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pria">Pria</SelectItem>
                        <SelectItem value="wanita">Wanita</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studyProgram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Studi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Teknik Informatika"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Jl. Merdeka No. 10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || uploading}
              >
                {form.formState.isSubmitting
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
