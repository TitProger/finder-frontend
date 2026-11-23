import type { HttpHeaders } from "../../common/types";
import type { TokenStorage } from "../../common/token-storage";

export function buildHeaders(
  tokenStorage: TokenStorage,
  options: {
    body?: BodyInit | null;
    optionHeaders?: HeadersInit;
  },
): HttpHeaders {
  const headers: HttpHeaders = {};
  const hasBody = options.body != null && options.body !== "";

  if (hasBody && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (options.optionHeaders) {
    for (const [key, value] of Object.entries(options.optionHeaders)) {
      if (value !== undefined && value !== null) {
        headers[key] = String(value);
      }
    }
  }

  const token = tokenStorage.get();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
