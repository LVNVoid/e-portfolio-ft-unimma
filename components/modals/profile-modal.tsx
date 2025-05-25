"use client";

import * as z from "zod";
import axios from "axios";
import { useProfileModal } from "@/hooks/use-profile-modal";
import Modal from "../ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera, Loader2, X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  gender: z.enum(["pria", "wanita"]),
  address: z.string().min(1, { message: "Alamat wajib diisi" }),
  studyProgram: z.string().min(1, { message: "Program studi wajib diisi" }),
  profilePicture: z.string().optional(),
});

export default function ProfileModal() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const profileModal = useProfileModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "pria",
      address: "",
      studyProgram: "",
      profilePicture: "",
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Hanya file JPEG, PNG, dan WebP yang diizinkan");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

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
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    form.setValue("profilePicture", "");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await axios.post("/api/users", values);
      toast.success("Biodata berhasil disimpan");

      // Reset form dan tutup modal
      form.reset();
      setImagePreview("");
      profileModal.onClose();
    } catch (error) {
      toast.error("Biodata gagal disimpan");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    form.reset();
    setImagePreview("");
    profileModal.onClose();
  };

  return (
    <Modal
      title="Bio Profil"
      description="Lengkapi data profil anda"
      isOpen={profileModal.isOpen}
      onClose={handleModalClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Profile Picture Upload Section */}
            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto Profil</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center space-y-4">
                      {/* Avatar Preview */}
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage
                            src={imagePreview || field.value}
                            alt="Profile picture"
                            className="object-cover"
                          />
                          <AvatarFallback className="text-lg">
                            <Camera className="w-6 h-6 text-gray-400" />
                          </AvatarFallback>
                        </Avatar>

                        {/* Remove button */}
                        {(imagePreview || field.value) && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}

                        {/* Loading overlay */}
                        {uploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Upload button */}
                      <div className="flex flex-col items-center space-y-2">
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
                          className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 cursor-pointer ${
                            uploading ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Mengupload...
                            </>
                          ) : (
                            <>
                              <Camera className="w-4 h-4 mr-2" />
                              {imagePreview || field.value
                                ? "Ganti Foto"
                                : "Upload Foto"}
                            </>
                          )}
                        </label>
                        <p className="text-sm text-gray-500 text-center">
                          JPG, PNG, atau WebP. Maksimal 5MB.
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama lengkap" {...field} />
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Alamat lengkap" {...field} />
                  </FormControl>
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
                    <Input placeholder="Program Studi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
