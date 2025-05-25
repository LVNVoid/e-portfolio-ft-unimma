"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Definisikan tipe data Portfolio
export type Portfolio = {
  id: string;
  title: string;
  level: "nasional" | "universitas" | "regional";
  category: "prestasi" | "kegiatan";
  date: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    studyProgram: string | null;
  };
};

export const columns: ColumnDef<Portfolio>[] = [
  {
    accessorKey: "user.name",
    header: "Nama",
    cell: ({ row }) => {
      const user = row.original.user;
      return <div>{user?.name || "-"}</div>;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Judul
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "level",
    header: "Tingkat",
  },
  {
    accessorKey: "category",
    header: "Kategori Portofolio",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <Badge variant={category === "prestasi" ? "default" : "secondary"}>
          {category}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date")); // pastikan ini adalah objek Date
      return <div>{format(date, "PPP", { locale: id })}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const portfolio = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(portfolio.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                window.location.assign(`/portfolio/${portfolio.id}`);
              }}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
