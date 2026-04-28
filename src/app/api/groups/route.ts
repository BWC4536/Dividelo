import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { createGroupSchema } from "@/lib/validations/group";

// GET /api/groups — list all groups for current user
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const groups = await db.group.findMany({
      where: {
        members: {
          some: { userId: session.user.id },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        _count: {
          select: { expenses: true, members: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(groups);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/groups — create new group
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const body = await request.json();
    const data = createGroupSchema.parse(body);

    const group = await db.group.create({
      data: {
        ...data,
        createdById: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "admin",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        _count: {
          select: { expenses: true, members: true },
        },
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
