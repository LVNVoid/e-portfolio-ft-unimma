"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { PortfolioCategory, PortfolioLevel } from "@/lib/generated/prisma";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";

interface PortfolioFormProps {
  userId: string;
}

const portfolioFormSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(100),
  description: z.string().optional(),
  level: z.nativeEnum(PortfolioLevel),
  category: z.nativeEnum(PortfolioCategory),
  date: z.date({
    required_error: "Tanggal diperlukan",
  }),
  docsUrl: z.string().optional().or(z.literal("")),
});

export function PortfolioForm({ userId }: PortfolioFormProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<z.infer<typeof portfolioFormSchema>>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: "",
      docsUrl: "",
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (file.type !== "application/pdf") {
      toast.error("Hanya file PDF yang diizinkan");
      return;
    }

    // Validasi ukuran file (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return null;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const response = await axios.post("/api/upload/document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        toast.success("File berhasil diupload");
        return response.data.url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "Gagal mengupload file";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    // Reset the file input
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  async function onSubmit(values: z.infer<typeof portfolioFormSchema>) {
    try {
      let uploadedFileUrl = "";

      // Upload file jika ada file yang dipilih
      if (selectedFile) {
        const fileUrl = await handleFileUpload();
        if (fileUrl) {
          uploadedFileUrl = fileUrl;
        } else {
          // Jika upload gagal, hentikan proses
          toast.error("Upload file gagal, silakan coba lagi");
          return;
        }
      }

      // Submit portfolio data
      await axios.post("/api/portfolios", {
        ...values,
        docsUrl: uploadedFileUrl,
        userId,
      });

      toast.success("Portofolio berhasil ditambahkan");
      router.push("/portfolio");
      router.refresh();
    } catch (error) {
      console.error("Error adding portfolio:", error);

      let errorMessage = "Terjadi kesalahan saat menambahkan portfolio";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      toast.error("Portofolio gagal ditambahkan");

      console.error(errorMessage);
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Fields Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Judul Portfolio - Full width on mobile, half on desktop */}
            <div className="lg:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Judul Portfolio *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Juara 1 Hackathon Nasional"
                        className="h-11 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Level */}
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Tingkat *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue placeholder="Pilih tingkat portfolio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PortfolioLevel).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kategori */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Kategori *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue placeholder="Pilih kategori portfolio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PortfolioCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal */}
            <div className="lg:col-span-1">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-base font-medium">
                      Tanggal *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-11 text-base font-normal justify-start text-left",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd MMMM yyyy")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Deskripsi - Full width */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Deskripsi
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Deskripsi singkat tentang portfolio, pencapaian, atau konteks yang ingin Anda bagikan..."
                    className="min-h-[120px] text-base resize-none"
                    {...field}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Opsional: Tambahkan deskripsi untuk memberikan konteks lebih
                  pada portfolio Anda
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload Section */}
          <FormField
            control={form.control}
            name="docsUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Dokumen Portfolio
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-border rounded-xl p-8 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5">
                      {!selectedFile ? (
                        <div className="text-center space-y-4">
                          <div className="flex justify-center">
                            <div className="relative">
                              <Upload className="h-16 w-16 text-muted-foreground/60" />
                              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                                <FileText className="h-4 w-4 text-primary-foreground" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="file-upload"
                              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                              Pilih File PDF
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept=".pdf,application/pdf"
                                className="sr-only"
                                onChange={handleFileSelect}
                              />
                            </label>
                            <p className="text-sm text-muted-foreground">
                              atau drag & drop file PDF Anda di sini
                            </p>
                            <p className="text-xs text-muted-foreground/80">
                              Maksimal ukuran file 10MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                          <div className="flex items-center space-x-4">
                            <div className="bg-destructive/10 p-3 rounded-lg">
                              <FileText className="h-6 w-6 text-destructive" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">
                                {selectedFile.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeSelectedFile}
                            disabled={isUploading}
                            className="hover:bg-destructive/10 hover:text-destructive h-10 w-10 p-0 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="mt-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              <span className="text-sm font-medium text-foreground">
                                Mengupload file...
                              </span>
                            </div>
                            <span className="text-sm font-medium text-primary">
                              {uploadProgress}%
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Upload file PDF untuk melengkapi portfolio Anda. File ini
                      akan membantu memverifikasi pencapaian Anda.
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="sm:w-auto h-11 text-base font-medium"
              onClick={() => router.back()}
              disabled={form.formState.isSubmitting || isUploading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isUploading}
              className="flex-1 sm:flex-none sm:min-w-[200px] h-11 text-base font-medium"
            >
              {form.formState.isSubmitting || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Mengupload..." : "Menyimpan..."}
                </>
              ) : (
                "Simpan Portfolio"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
