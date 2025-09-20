export function parseISOYmd(ymd?: string): Date | undefined {
  if (!ymd) return undefined;

  const [yearString, monthString, dayString] = ymd.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  const dateObject = new Date(year, month - 1, day, 0, 0, 0, 0);
  return Number.isNaN(dateObject.getTime()) ? undefined : dateObject;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatISOYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayYmd(): string {
  return formatISOYmd(startOfToday());
}

export function isWithinInclusiveDay(
  date: Date,
  startDate: Date,
  endDate: Date
): boolean {
  const dateMs = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
  const startMs = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  ).getTime();
  const endMs = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  ).getTime();
  return dateMs >= startMs && dateMs <= endMs;
}

const MILLISECONDS_PER_DAY = 86_400_000;

export function nightsBetween(from: Date, to: Date): number {
  const fromAtMidnight = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate()
  );
  const toAtMidnight = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  const millisecondsBetween = toAtMidnight.getTime() - fromAtMidnight.getTime();
  return Math.max(1, Math.round(millisecondsBetween / MILLISECONDS_PER_DAY));
}

export function dateRangeLabel(from: Date, to: Date, locale = 'en-GB'): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const fromText = from.toLocaleDateString(locale, formatOptions);
  const toText = to.toLocaleDateString(locale, formatOptions);
  return `${fromText} – ${toText}`;
}

export function parseDotToISO(value: string): string | undefined {
  const match = value.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!match) return undefined;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const dateObject = new Date(year, month - 1, day);
  const isInvalid =
    Number.isNaN(dateObject.getTime()) ||
    dateObject.getDate() !== day ||
    dateObject.getMonth() !== month - 1;

  if (isInvalid) return undefined;

  const monthPadded = String(month).padStart(2, '0');
  const dayPadded = String(day).padStart(2, '0');
  return `${year}-${monthPadded}-${dayPadded}`;
}

export function formatDotFromISO(iso?: string): string {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  return `${day}.${month}.${year}`;
}
