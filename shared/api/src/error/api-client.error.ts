import type { ApiResponse } from "../../generated/types/common";

export type ApiErrorBody = ApiResponse & { status: "error" };

export class ApiClientError extends Error {
  readonly code: string;
  readonly httpStatus?: number;
  readonly requestId?: string;

  constructor(
    message: string,
    options: {
      code?: string;
      httpStatus?: number;
      requestId?: string;
    } = {},
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = options.code ?? "UNKNOWN_ERROR";
    this.httpStatus = options.httpStatus;
    this.requestId = options.requestId;
  }

  static fromResponse(response: ApiErrorBody, httpStatus?: number): ApiClientError {
    const code = String(response.error?.code ?? "UNKNOWN_ERROR");

    return new ApiClientError(code, {
      code,
      httpStatus,
      requestId: response.requestId,
    });
  }

  static network(): ApiClientError {
    return new ApiClientError("NETWORK_ERROR", {
      code: "NETWORK_ERROR",
    });
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function isApiErrorResponse(value: unknown): value is ApiErrorBody {
  return value != null && typeof value === "object" && (value as ApiResponse).status === "error";
}
