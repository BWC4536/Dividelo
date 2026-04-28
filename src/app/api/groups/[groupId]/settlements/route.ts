import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";
import { createSettlementSchema } from "@/lib/validations/settlement";

async function requireGroupMember(groupId: string, userId: string) {
  const member = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!member) throw Errors.FORBIDDEN;
  return member;
}

// GET /api/groups/[groupId]/settlements
export async function GET(
  _request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    await requireGroupMember(params.groupId, session.user.id);

    const settlements = await db.settlement.findMany({
      where: { groupId: params.groupId },
      include: {
        payer: {
          select: { id: true, name: true, email: true, image: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(settlements);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/groups/[groupId]/settlements
export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    await requireGroupMember(params.groupId, session.user.id);

    const body = await request.json();
    const data = createSettlementSchema.parse(body);

    // Validate both payer and receiver are group members
    const [payerMember, receiverMember] = await Promise.all([
      db.groupMember.findUnique({
        where: { groupId_userId: { groupId: params.groupId, userId: data.payerId } },
      }),
      db.groupMember.findUnique({
        where: { groupId_userId: { groupId: params.groupId, userId: data.receiverId } },
      }),
    ]);

    if (!payerMember) throw Errors.BAD_REQUEST("Payer is not a group member");
    if (!receiverMember) throw Errors.BAD_REQUEST("Receiver is not a group member");

    const settlement = await db.$transaction(async (tx) => {
      const newSettlement = await tx.settlement.create({
        data: {
          groupId: params.groupId,
          payerId: data.payerId,
          receiverId: data.receiverId,
          amount: data.amount,
          currency: data.currency,
          note: data.note,
          date: data.date ? new Date(data.date) : new Date(),
        },
        include: {
          payer: {
            select: { id: true, name: true, email: true, image: true },
          },
          receiver: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });

      // Notify the receiver
      if (data.receiverId !== session.user.id) {
        await tx.notification.create({
          data: {
            userId: data.receiverId,
            type: "settlement",
            title: "Pago recibido",
            message: `${session.user.name ?? session.user.email} te ha pagado ${data.amount} ${data.currency}`,
            data: JSON.stringify({ groupId: params.groupId, settlementId: newSettlement.id }),
          },
        });
      }

      return newSettlement;
    });

    return NextResponse.json(settlement, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
