import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { addMemberSchema } from "@/lib/validations/group";

async function requireGroupMember(groupId: string, userId: string) {
  const member = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!member) throw Errors.FORBIDDEN;
  return member;
}

// GET /api/groups/[groupId]/members
export async function GET(
  _request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    await requireGroupMember(params.groupId, session.user.id);

    const members = await db.groupMember.findMany({
      where: { groupId: params.groupId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, currency: true },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    return NextResponse.json(members);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/groups/[groupId]/members — add member by email
export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const currentMember = await requireGroupMember(params.groupId, session.user.id);
    if (currentMember.role !== "admin") throw Errors.FORBIDDEN;

    const body = await request.json();
    const { email } = addMemberSchema.parse(body);

    // Find user by email
    const userToAdd = await db.user.findUnique({ where: { email } });
    if (!userToAdd) throw Errors.NOT_FOUND("User with that email");

    // Check if already member
    const existingMember = await db.groupMember.findUnique({
      where: { groupId_userId: { groupId: params.groupId, userId: userToAdd.id } },
    });
    if (existingMember) throw Errors.CONFLICT("User is already a member");

    const member = await db.groupMember.create({
      data: {
        groupId: params.groupId,
        userId: userToAdd.id,
        role: "member",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    // Notify the added user
    await db.notification.create({
      data: {
        userId: userToAdd.id,
        type: "group_invite",
        title: "Te han añadido a un grupo",
        message: `${session.user.name ?? session.user.email} te ha añadido a un grupo.`,
        data: JSON.stringify({ groupId: params.groupId }),
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
