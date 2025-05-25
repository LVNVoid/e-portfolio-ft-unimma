import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@clerk/nextjs/server";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validasi tipe file - lebih ketat untuk PDF
    const allowedTypes = ["application/pdf"];
    const allowedExtensions = [".pdf"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validasi ekstensi file
    const fileExtension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Invalid file extension. Only .pdf files are allowed" },
        { status: 400 }
      );
    }

    // Validasi ukuran file (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Validasi nama file - hindari karakter berbahaya
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename dengan timestamp dan random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${userId}-${timestamp}-${randomString}${fileExtension}`;

    // Path untuk menyimpan file
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "documents"
    );
    const filePath = path.join(uploadDir, fileName);

    // Buat direktori jika belum ada
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
    } catch (mkdirError) {
      console.error("Error creating directory:", mkdirError);
      return NextResponse.json(
        { error: "Failed to create upload directory" },
        { status: 500 }
      );
    }

    // Simpan file
    try {
      await writeFile(filePath, buffer);
    } catch (writeError) {
      console.error("Error writing file:", writeError);
      return NextResponse.json(
        { error: "Failed to save file" },
        { status: 500 }
      );
    }

    // Return URL yang bisa diakses
    const fileUrl = `/uploads/documents/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      originalName: sanitizedOriginalName,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
