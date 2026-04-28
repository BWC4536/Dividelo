import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { createCommentSchema } from "@/lib/validations/expense";

async function requireGroupMember(groupId: string, userId: string) {
  const member = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!member) throw Errors.FORBIDDEN;
  return member;
}

// GET /api/groups/[groupId]/expenses/[expenseId]/comments
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
    });
    if (!expense) throw Errors.NOT_FOUND("Expense");

    const comments = await db.comment.findMany({
      where: { expenseId: params.expenseId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/groups/[groupId]/expenses/[expenseId]/comments
export async function POST(
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

    const body = await request.json();
    const { content } = createCommentSchema.parse(body);

    const comment = await db.comment.create({
      data: {
        expenseId: params.expenseId,
        userId: session.user.id,
        content,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
