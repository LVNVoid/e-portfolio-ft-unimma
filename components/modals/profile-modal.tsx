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

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  gender: z.enum(["pria", "wanita"]),
  address: z.string().min(1, { message: "Alamat wajib diisi" }),
  studyProgram: z.string().min(1, { message: "Program studi wajib diisi" }),
  profilePicture: z.string().url({ message: "Harus berupa URL yang valid" }),
});

export default function ProfileModal() {
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await axios.post("/api/users", values);
      toast.success("Biodata berhasil disimpan");
      form.reset();
      profileModal.onClose();
    } catch (error) {
      toast.error("Biodata gagal disimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Bio Profil"
      description="Lengkapi data profil anda"
      isOpen={profileModal.isOpen}
      onClose={profileModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Foto Profil</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                type="button"
                variant="outline"
                onClick={profileModal.onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
