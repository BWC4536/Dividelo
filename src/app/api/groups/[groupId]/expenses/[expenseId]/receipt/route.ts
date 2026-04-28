import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/groups/[groupId]/expenses/[expenseId]/receipt
export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string; expenseId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const member = await db.groupMember.findUnique({
      where: { groupId_userId: { groupId: params.groupId, userId: session.user.id } },
    });
    if (!member) throw Errors.FORBIDDEN;

    const expense = await db.expense.findUnique({
      where: { id: params.expenseId, groupId: params.groupId },
    });
    if (!expense) throw Errors.NOT_FOUND("Expense");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) throw Errors.BAD_REQUEST("No file provided");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      throw Errors.BAD_REQUEST("File must be an image (JPEG, PNG, WebP) or PDF");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw Errors.BAD_REQUEST("File size must be less than 10MB");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `receipt-${params.expenseId}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const receiptUrl = `/uploads/${filename}`;

    const updated = await db.expense.update({
      where: { id: params.expenseId },
      data: { receiptUrl },
      select: { id: true, receiptUrl: true },
    });

    return NextResponse.json({ receiptUrl, expense: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
