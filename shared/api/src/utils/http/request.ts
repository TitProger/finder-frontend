import type { RequestOptions } from "../../common/types";
import type { TokenStorage } from "../../common/token-storage";
import { ApiClientError, isApiErrorResponse } from "../../error/api-client.error";
import { buildHeaders } from "./build-headers";

function throwHttpError(data: unknown, httpStatus: number): never {
  if (isApiErrorResponse(data)) {
    throw ApiClientError.fromResponse(data, httpStatus);
  }

  throw new ApiClientError("UNKNOWN_ERROR", {
    code: "UNKNOWN_ERROR",
    httpStatus,
  });
}

export async function httpRequest<T>(
  baseUrl: string,
  path: string,
  tokenStorage: TokenStorage,
  options: RequestOptions = {},
): Promise<T> {
  const { headers: optionHeaders, ...restOptions } = options;
  const headers = buildHeaders(tokenStorage, {
    body: restOptions.body,
    optionHeaders,
  });

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: restOptions.method || "GET",
      ...restOptions,
      headers: headers as HeadersInit,
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      throwHttpError(data, response.status);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw ApiClientError.network();
    }

    throw error;
  }
}
