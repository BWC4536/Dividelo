import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { inviteTokenSchema } from "@/lib/validations/group";

// POST /api/groups/[groupId]/invite — generate invite token
export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const member = await db.groupMember.findUnique({
      where: { groupId_userId: { groupId: params.groupId, userId: session.user.id } },
    });
    if (!member) throw Errors.FORBIDDEN;

    const body = await request.json().catch(() => ({}));
    const { expiresInDays } = inviteTokenSchema.parse(body);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const invite = await db.inviteToken.create({
      data: {
        groupId: params.groupId,
        createdById: session.user.id,
        expiresAt,
      },
      include: {
        group: {
          select: { id: true, name: true, currency: true },
        },
      },
    });

    const inviteUrl = `${process.env.NEXTAUTH_URL}/invite/${invite.token}`;

    return NextResponse.json({ ...invite, inviteUrl }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/groups/[groupId]/invite — get group info by invite token
export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) throw Errors.BAD_REQUEST("Token is required");

    const invite = await db.inviteToken.findUnique({
      where: { token },
      include: {
        group: {
          include: {
            _count: { select: { members: true } },
          },
        },
        createdBy: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    if (!invite) throw Errors.NOT_FOUND("Invite token");
    if (invite.groupId !== params.groupId) throw Errors.NOT_FOUND("Invite token");
    if (invite.expiresAt < new Date()) {
      throw Errors.BAD_REQUEST("Invite token has expired");
    }
    if (invite.usedAt) {
      throw Errors.BAD_REQUEST("Invite token has already been used");
    }

    return NextResponse.json({
      group: invite.group,
      createdBy: invite.createdBy,
      expiresAt: invite.expiresAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
