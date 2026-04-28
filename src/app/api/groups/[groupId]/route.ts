import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { updateGroupSchema } from "@/lib/validations/group";

async function requireGroupMember(groupId: string, userId: string) {
  const member = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!member) throw Errors.FORBIDDEN;
  return member;
}

// GET /api/groups/[groupId]
export async function GET(
  _request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    await requireGroupMember(params.groupId, session.user.id);

    const group = await db.group.findUnique({
      where: { id: params.groupId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, image: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        _count: {
          select: { expenses: true, members: true, settlements: true },
        },
      },
    });

    if (!group) throw Errors.NOT_FOUND("Group");

    return NextResponse.json(group);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/groups/[groupId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const member = await requireGroupMember(params.groupId, session.user.id);
    if (member.role !== "admin") throw Errors.FORBIDDEN;

    const body = await request.json();
    const data = updateGroupSchema.parse(body);

    const group = await db.group.update({
      where: { id: params.groupId },
      data,
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

    return NextResponse.json(group);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/groups/[groupId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const group = await db.group.findUnique({
      where: { id: params.groupId },
    });

    if (!group) throw Errors.NOT_FOUND("Group");
    if (group.createdById !== session.user.id) throw Errors.FORBIDDEN;

    await db.group.delete({ where: { id: params.groupId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
