import { ApiClientError, isApiErrorResponse } from "./api-client.error";

export function throwIfApiError(response: unknown): void {
  if (isApiErrorResponse(response)) {
    throw ApiClientError.fromResponse(response);
  }
}
