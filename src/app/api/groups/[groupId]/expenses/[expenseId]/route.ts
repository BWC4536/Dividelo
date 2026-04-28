import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { updateExpenseSchema } from "@/lib/validations/expense";

async function requireGroupMember(groupId: string, userId: string) {
  const member = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!member) throw Errors.FORBIDDEN;
  return member;
}

// GET /api/groups/[groupId]/expenses/[expenseId]
export async function GET(
  _request: NextRequest,
  { params }: { params: { groupId: string; expenseId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    await requireGroupMember(params.groupId, session.user.id);

    const expense = await db.expense.findUnique({
      where: { id: params.expenseId, groupId: params.groupId },
      include: {
        paidBy: {
          select: { id: true, name: true, email: true, image: true },
        },
        splits: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!expense) throw Errors.NOT_FOUND("Expense");

    return NextResponse.json(expense);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/groups/[groupId]/expenses/[expenseId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { groupId: string; expenseId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    await requireGroupMember(params.groupId, session.user.id);

    const expense = await db.expense.findUnique({
      where: { id: params.expenseId, groupId: params.groupId },
    });

    if (!expense) throw Errors.NOT_FOUND("Expense");
    if (expense.paidById !== session.user.id) {
      // Check if admin
      const member = await db.groupMember.findUnique({
        where: { groupId_userId: { groupId: params.groupId, userId: session.user.id } },
      });
      if (member?.role !== "admin") throw Errors.FORBIDDEN;
    }

    const body = await request.json();
    const data = updateExpenseSchema.parse(body);

    const updated = await db.$transaction(async (tx) => {
      if (data.splits) {
        // Delete existing splits and recreate
        await tx.expenseSplit.deleteMany({ where: { expenseId: params.expenseId } });
      }

      return tx.expense.update({
        where: { id: params.expenseId },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.amount !== undefined && { amount: data.amount }),
          ...(data.currency && { currency: data.currency }),
          ...(data.category && { category: data.category }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.date && { date: new Date(data.date) }),
          ...(data.paidById && { paidById: data.paidById }),
          ...(data.splits && {
            splits: {
              create: data.splits.map((s) => ({
                userId: s.userId,
                amount: s.amount,
              })),
            },
          }),
        },
        include: {
          paidBy: {
            select: { id: true, name: true, email: true, image: true },
          },
          splits: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/groups/[groupId]/expenses/[expenseId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { groupId: string; expenseId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    await requireGroupMember(params.groupId, session.user.id);

    const expense = await db.expense.findUnique({
      where: { id: params.expenseId, groupId: params.groupId },
    });

    if (!expense) throw Errors.NOT_FOUND("Expense");

    // Allow deletion if payer or admin
    if (expense.paidById !== session.user.id) {
      const member = await db.groupMember.findUnique({
        where: { groupId_userId: { groupId: params.groupId, userId: session.user.id } },
      });
      if (member?.role !== "admin") throw Errors.FORBIDDEN;
    }

    await db.expense.delete({ where: { id: params.expenseId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
