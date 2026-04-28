import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("[API Error]", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}

export const Errors = {
  UNAUTHORIZED: new ApiError("Unauthorized", 401, "UNAUTHORIZED"),
  FORBIDDEN: new ApiError("Forbidden", 403, "FORBIDDEN"),
  NOT_FOUND: (resource: string) =>
    new ApiError(`${resource} not found`, 404, "NOT_FOUND"),
  BAD_REQUEST: (message: string) =>
    new ApiError(message, 400, "BAD_REQUEST"),
  CONFLICT: (message: string) =>
    new ApiError(message, 409, "CONFLICT"),
  INTERNAL: new ApiError("Internal server error", 500, "INTERNAL"),
};
