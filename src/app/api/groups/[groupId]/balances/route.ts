import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { calculateGroupBalances } from "@/lib/utils/balance";

// GET /api/groups/[groupId]/balances
export async function GET(
  _request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const isMember = await db.groupMember.findUnique({
      where: { groupId_userId: { groupId: params.groupId, userId: session.user.id } },
    });
    if (!isMember) throw Errors.FORBIDDEN;

    const group = await db.group.findUnique({
      where: { id: params.groupId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        expenses: {
          include: {
            splits: true,
          },
        },
        settlements: true,
      },
    });

    if (!group) throw Errors.NOT_FOUND("Group");

    const members = group.members.map((m) => ({
      userId: m.userId,
      name: m.user.name ?? m.user.email,
      email: m.user.email,
      image: m.user.image,
    }));

    const expenses = group.expenses.map((e) => ({
      paidById: e.paidById,
      amount: e.amount,
      splits: e.splits.map((s) => ({
        userId: s.userId,
        amount: s.amount,
        isSettled: s.isSettled,
      })),
    }));

    const settlements = group.settlements.map((s) => ({
      payerId: s.payerId,
      receiverId: s.receiverId,
      amount: s.amount,
    }));

    const result = calculateGroupBalances(members, expenses, settlements);

    return NextResponse.json({
      ...result,
      currency: group.currency,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
