"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";

interface PortfolioFormProps {
  userId: string;
}

const portfolioFormSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(100),
  level: z.nativeEnum(PortfolioLevel),
  category: z.nativeEnum(PortfolioCategory),
  date: z.date({
    required_error: "Tanggal diperlukan",
  }),
  docsUrl: z
    .string()
    .url("Harus berupa URL valid")
    .optional()
    .or(z.literal("")),
});

export function PortfolioForm({ userId }: PortfolioFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof portfolioFormSchema>>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: "",
      docsUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof portfolioFormSchema>) {
    console.log(values);
    try {
      await axios.post("/api/portfolios", {
        ...values,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Portfolio</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Juara 1 Hackathon Nasional"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tingkat</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
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

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
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

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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

        <FormField
          control={form.control}
          name="docsUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Dokumen (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/sertifikat.pdf"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Portfolio"}
        </Button>
      </form>
    </Form>
  );
}
