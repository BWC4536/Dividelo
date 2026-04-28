import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  currency: z.string().length(3).optional(),
  image: z.string().url().optional().or(z.literal("")),
});

// GET /api/users/[userId]
export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const user = await db.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        currency: true,
        createdAt: true,
        _count: {
          select: {
            groupMembers: true,
            paidExpenses: true,
          },
        },
      },
    });

    if (!user) throw Errors.NOT_FOUND("User");

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/users/[userId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;
    if (session.user.id !== params.userId) throw Errors.FORBIDDEN;

    const body = await request.json();
    const data = updateProfileSchema.parse(body);

    const user = await db.user.update({
      where: { id: params.userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        currency: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}
