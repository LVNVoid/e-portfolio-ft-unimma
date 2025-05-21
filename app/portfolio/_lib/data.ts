import { Portfolio } from "../_components/columns";

export async function getPortfolios(category?: string): Promise<Portfolio[]> {
  // Data dummy untuk demonstrasi
  // Dalam aplikasi sebenarnya, Anda akan mengambil data dari API atau database
  const portfolios: Portfolio[] = [
    {
      id: "1",
      title: "Pembuatan Website Profil Sekolah",
      level: "universitas",
      category: "kegiatan",
      date: new Date("2023-06-15"),
    },
    {
      id: "2",
      title: "Juara 2 Lomba Desain UI/UX Nasional",
      level: "nasional",
      category: "prestasi",
      date: new Date("2023-07-20"),
    },
    {
      id: "3",
      title: "Anggota Divisi IT BEM Fakultas",
      level: "universitas",
      category: "kegiatan",
      date: new Date("2023-08-01"),
    },
    {
      id: "4",
      title: "Juara 1 Hackathon Regional",
      level: "regional",
      category: "prestasi",
      date: new Date("2023-09-10"),
    },
    {
      id: "5",
      title: "Mentor Kelas Pemrograman Dasar",
      level: "universitas",
      category: "kegiatan",
      date: new Date("2023-10-05"),
    },
    {
      id: "6",
      title: "Finalis Olimpiade Sains Mahasiswa",
      level: "nasional",
      category: "prestasi",
      date: new Date("2023-11-12"),
    },
    {
      id: "7",
      title: "Workshop Machine Learning Organizer",
      level: "universitas",
      category: "kegiatan",
      date: new Date("2024-01-18"),
    },
    {
      id: "8",
      title: "Juara Favorit Lomba Video Edukasi",
      level: "nasional",
      category: "prestasi",
      date: new Date("2024-02-25"),
    },
    {
      id: "9",
      title: "Volunteer Seminar Teknologi Digital",
      level: "universitas",
      category: "kegiatan",
      date: new Date("2024-03-10"),
    },
    {
      id: "10",
      title: "Juara 3 Kompetisi Startup Mahasiswa",
      level: "nasional",
      category: "prestasi",
      date: new Date("2024-04-30"),
    },
  ];

  // Filter berdasarkan kategori jika parameter kategori disediakan
  if (category) {
    return portfolios.filter((portfolio) => portfolio.category === category);
  }

  return portfolios;
}
