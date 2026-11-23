export function serializeBody(data: unknown): BodyInit | undefined {
  if (data === undefined || data === null) {
    return undefined;
  }

  return JSON.stringify(data);
}
