const MONTHS = ["янв.", "февр.", "мар.", "апр.", "мая", "июн.", "июл.", "авг.", "сент.", "окт.", "нояб.", "дек."];

function moscowParts(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
}

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((item) => item.type === type)?.value ?? "";
}

export function formatDay(iso: string): string {
  const parts = moscowParts(iso);
  const month = MONTHS[Number(part(parts, "month")) - 1] ?? "";

  return `${part(parts, "day")} ${month}`;
}

export function formatDayTime(iso: string): string {
  const parts = moscowParts(iso);
  const month = MONTHS[Number(part(parts, "month")) - 1] ?? "";

  return `${part(parts, "day")} ${month}, ${part(parts, "hour")}:${part(parts, "minute")}`;
}

export function contentLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  let word = "карточек";

  if (mod10 === 1 && mod100 !== 11) {
    word = "карточка";
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    word = "карточки";
  }

  return `${count} ${word}`;
}

export function pageRange(page: number, limit: number, total: number): string {
  if (total === 0) {
    return "0 из 0";
  }

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return `${from}–${to} из ${total}`;
}

export function errorText(error: unknown): string {
  return error instanceof Error ? error.message : "UNKNOWN_ERROR";
}
