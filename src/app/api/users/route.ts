import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, Errors } from "@/lib/api/errors";

// GET /api/users?email=... — search user by email
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw Errors.UNAUTHORIZED;

    const email = request.nextUrl.searchParams.get("email");
    if (!email) {
      throw Errors.BAD_REQUEST("Email parameter is required");
    }

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      throw Errors.NOT_FOUND("User");
    }

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}
