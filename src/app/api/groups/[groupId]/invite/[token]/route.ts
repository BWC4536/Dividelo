import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";

// POST /api/groups/[groupId]/invite/[token] — join group via invite token
export async function POST(
  _request: NextRequest,
  { params }: { params: { groupId: string; token: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const invite = await db.inviteToken.findUnique({
      where: { token: params.token },
      include: {
        group: {
          select: { id: true, name: true },
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

    // Check if already a member
    const existingMember = await db.groupMember.findUnique({
      where: { groupId_userId: { groupId: params.groupId, userId: session.user.id } },
    });

    if (existingMember) {
      throw Errors.CONFLICT("You are already a member of this group");
    }

    const sessionUser = session.user!;
    const result = await db.$transaction(async (tx) => {
      const member = await tx.groupMember.create({
        data: {
          groupId: params.groupId,
          userId: sessionUser.id as string,
          role: "member",
        },
        include: {
          group: {
            select: { id: true, name: true, currency: true },
          },
        },
      });

      // Mark token as used
      await tx.inviteToken.update({
        where: { id: invite.id },
        data: { usedAt: new Date() },
      });

      // Notify group admin
      await tx.notification.create({
        data: {
          userId: invite.createdById,
          type: "member_joined",
          title: "Nuevo miembro",
          message: `${sessionUser.name ?? sessionUser.email} se ha unido al grupo ${invite.group.name}`,
          data: JSON.stringify({ groupId: params.groupId }),
        },
      });

      return member;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
