import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/users/[userId]/avatar
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;
    if (session.user.id !== params.userId) throw Errors.FORBIDDEN;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      throw Errors.BAD_REQUEST("No file provided");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw Errors.BAD_REQUEST("File must be an image");
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw Errors.BAD_REQUEST("File size must be less than 5MB");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `avatar-${params.userId}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;

    // Update user
    const user = await db.user.update({
      where: { id: params.userId },
      data: { image: imageUrl },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({ imageUrl, user });
  } catch (error) {
    return handleApiError(error);
  }
}
