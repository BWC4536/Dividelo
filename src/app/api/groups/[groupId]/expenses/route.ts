import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { createExpenseSchema } from "@/lib/validations/expense";

async function requireGroupMember(groupId: string, userId: string) {
  const member = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!member) throw Errors.FORBIDDEN;
  return member;
}

// GET /api/groups/[groupId]/expenses
export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    await requireGroupMember(params.groupId, session.user.id);

    const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "20");
    const category = request.nextUrl.searchParams.get("category");

    const where: Record<string, unknown> = { groupId: params.groupId };
    if (category) where.category = category;

    const [expenses, total] = await Promise.all([
      db.expense.findMany({
        where,
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
          _count: { select: { comments: true } },
        },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.expense.count({ where }),
    ]);

    return NextResponse.json({
      expenses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/groups/[groupId]/expenses
export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    await requireGroupMember(params.groupId, session.user.id);

    const body = await request.json();
    const data = createExpenseSchema.parse(body);

    // Validate paidBy is group member
    const paidByMember = await db.groupMember.findUnique({
      where: { groupId_userId: { groupId: params.groupId, userId: data.paidById } },
    });
    if (!paidByMember) {
      throw Errors.BAD_REQUEST("Payer must be a group member");
    }

    // Validate all split users are group members
    const splitUserIds = data.splits.map((s) => s.userId);
    const splitMembers = await db.groupMember.findMany({
      where: { groupId: params.groupId, userId: { in: splitUserIds } },
    });
    if (splitMembers.length !== splitUserIds.length) {
      throw Errors.BAD_REQUEST("All split participants must be group members");
    }

    // Create expense with splits in a transaction
    const expense = await db.$transaction(async (tx) => {
      const newExpense = await tx.expense.create({
        data: {
          groupId: params.groupId,
          paidById: data.paidById,
          title: data.title,
          amount: data.amount,
          currency: data.currency,
          category: data.category,
          description: data.description,
          date: data.date ? new Date(data.date) : new Date(),
          splits: {
            create: data.splits.map((s) => ({
              userId: s.userId,
              amount: s.amount,
            })),
          },
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

      // Notify all group members except the creator
      const sessionUser = session.user!;
      const members = await tx.groupMember.findMany({
        where: {
          groupId: params.groupId,
          userId: { not: sessionUser.id },
        },
        select: { userId: true },
      });

      if (members.length > 0) {
        await tx.notification.createMany({
          data: members.map((m) => ({
            userId: m.userId,
            type: "new_expense",
            title: "Nuevo gasto",
            message: `${sessionUser.name ?? sessionUser.email} añadió "${data.title}" por ${data.amount} ${data.currency}`,
            data: JSON.stringify({ groupId: params.groupId, expenseId: newExpense.id }),
          })),
        });
      }

      return newExpense;
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
