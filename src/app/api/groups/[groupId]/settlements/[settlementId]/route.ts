import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";

// DELETE /api/groups/[groupId]/settlements/[settlementId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { groupId: string; settlementId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const member = await db.groupMember.findUnique({
      where: { groupId_userId: { groupId: params.groupId, userId: session.user.id } },
    });
    if (!member) throw Errors.FORBIDDEN;

    const settlement = await db.settlement.findUnique({
      where: { id: params.settlementId, groupId: params.groupId },
    });
    if (!settlement) throw Errors.NOT_FOUND("Settlement");

    // Only payer or admin can delete
    if (settlement.payerId !== session.user.id && member.role !== "admin") {
      throw Errors.FORBIDDEN;
    }

    await db.settlement.delete({ where: { id: params.settlementId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
