/**
 * Date utilities for local calendar calculations and simple string formats.
 */

/** Parse a `YYYY-MM-DD` string into a local `Date` at midnight. */
export function parseISOYmd(ymd?: string): Date | undefined {
  if (!ymd) return undefined;

  const [yearString, monthString, dayString] = ymd.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  const dateObject = new Date(year, month - 1, day, 0, 0, 0, 0);
  return Number.isNaN(dateObject.getTime()) ? undefined : dateObject;
}

/** Get a `Date` for the start of the current local day (00:00). */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Format a `Date` as `YYYY-MM-DD` using local calendar fields. */
export function formatISOYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Convenience helper for today's date as `YYYY-MM-DD`. */
export function todayYmd(): string {
  return formatISOYmd(startOfToday());
}

/** Check if `date` is within `[startDate, endDate]` (inclusive) comparing calendar days. */
export function isWithinInclusiveDay(date: Date, startDate: Date, endDate: Date): boolean {
  const dateMs = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const startMs = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  ).getTime();
  const endMs = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
  return dateMs >= startMs && dateMs <= endMs;
}

const MILLISECONDS_PER_DAY = 86_400_000;

/** Count nights between two dates by comparing local midnights; returns at least `1`. */
export function nightsBetween(from: Date, to: Date): number {
  const fromAtMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const toAtMidnight = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  const millisecondsBetween = toAtMidnight.getTime() - fromAtMidnight.getTime();
  return Math.max(1, Math.round(millisecondsBetween / MILLISECONDS_PER_DAY));
}

/** Create a human-readable label for a date range (e.g., "Sep 1, 2025 – Sep 3, 2025"). */
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

/** Parse `DD.MM.YYYY` into `YYYY-MM-DD`; returns `undefined` if invalid. */
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

/** Format a `YYYY-MM-DD` string as `DD.MM.YYYY`; returns empty string for falsy. */
export function formatDotFromISO(iso?: string): string {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  return `${day}.${month}.${year}`;
}
