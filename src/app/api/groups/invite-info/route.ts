import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 400 });

  const invite = await db.inviteToken.findUnique({
    where: { token },
    include: {
      group: {
        include: { _count: { select: { members: true } } },
      },
    },
  });

  if (!invite) return NextResponse.json({ error: "Invitación no encontrada" }, { status: 404 });
  if (invite.usedAt) return NextResponse.json({ error: "Esta invitación ya fue usada" }, { status: 410 });
  if (new Date() > invite.expiresAt) return NextResponse.json({ error: "La invitación ha caducado" }, { status: 410 });

  return NextResponse.json({ group: invite.group });
}
