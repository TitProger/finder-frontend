/**
 * Добавляет query-параметры к пути API.
 */
export function withQuery(
  path: string,
  query?: Record<string, string | number | boolean | undefined | null>,
): string {
  if (!query) {
    return path;
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  const qs = params.toString();

  return qs ? `${path}?${qs}` : path;
}
