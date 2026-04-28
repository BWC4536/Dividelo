import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";

// DELETE /api/notifications/[notificationId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const notification = await db.notification.findUnique({
      where: { id: params.notificationId },
    });

    if (!notification) throw Errors.NOT_FOUND("Notification");
    if (notification.userId !== session.user.id) throw Errors.FORBIDDEN;

    await db.notification.delete({ where: { id: params.notificationId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/notifications/[notificationId] — mark single as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const notification = await db.notification.findUnique({
      where: { id: params.notificationId },
    });

    if (!notification) throw Errors.NOT_FOUND("Notification");
    if (notification.userId !== session.user.id) throw Errors.FORBIDDEN;

    const body = await request.json().catch(() => ({}));
    const read = typeof body.read === "boolean" ? body.read : true;

    const updated = await db.notification.update({
      where: { id: params.notificationId },
      data: { read },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
