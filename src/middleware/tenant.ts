import type { RequestHandler } from "express";

import { ApiError } from "../errors/api-error";

const MAX_TENANT_ID_LENGTH = 255;

export const requireTenant: RequestHandler = (request, response, next) => {
  const tenantId = request.get("X-Tenant-ID")?.trim();

  if (!tenantId) {
    next(
      new ApiError(
        400,
        "TENANT_HEADER_REQUIRED",
        "X-Tenant-ID header is required",
      ),
    );
    return;
  }

  if (tenantId.length > MAX_TENANT_ID_LENGTH) {
    next(
      new ApiError(
        400,
        "INVALID_TENANT_HEADER",
        `X-Tenant-ID must not exceed ${MAX_TENANT_ID_LENGTH} characters`,
      ),
    );
    return;
  }

  response.locals.tenantId = tenantId;
  next();
};
