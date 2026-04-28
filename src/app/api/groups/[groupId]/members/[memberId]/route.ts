import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";

// DELETE /api/groups/[groupId]/members/[memberId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { groupId: string; memberId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const currentMember = await db.groupMember.findUnique({
      where: { groupId_userId: { groupId: params.groupId, userId: session.user.id } },
    });
    if (!currentMember) throw Errors.FORBIDDEN;

    const targetMember = await db.groupMember.findUnique({
      where: { id: params.memberId },
    });
    if (!targetMember || targetMember.groupId !== params.groupId) {
      throw Errors.NOT_FOUND("Member");
    }

    // Can only remove if admin or removing self
    const isAdmin = currentMember.role === "admin";
    const isSelf = targetMember.userId === session.user.id;

    if (!isAdmin && !isSelf) throw Errors.FORBIDDEN;

    // Cannot remove group owner (admin who created it)
    const group = await db.group.findUnique({ where: { id: params.groupId } });
    if (group?.createdById === targetMember.userId && !isSelf) {
      throw Errors.BAD_REQUEST("Cannot remove the group owner");
    }

    await db.groupMember.delete({ where: { id: params.memberId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
