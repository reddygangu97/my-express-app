import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { ApiError } from "../errors/api-error";

interface DatabaseErrorLike {
  code?: string;
  constraint?: string;
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
      },
    });
    return;
  }

  const databaseError = error as DatabaseErrorLike;

  if (
    databaseError.code === "23505" &&
    databaseError.constraint === "contacts_tenant_email_unique"
  ) {
    response.status(409).json({
      error: {
        code: "CONTACT_EMAIL_EXISTS",
        message: "A contact with this email already exists for this tenant",
      },
    });
    return;
  }

  console.error("Unhandled request error", error);
  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};
