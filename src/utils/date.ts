export function parseISOYmd(ymd?: string): Date | undefined {
  if (!ymd) return undefined;
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
  return Number.isNaN(dt.getTime()) ? undefined : dt;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatISOYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayYmd(): string {
  return formatISOYmd(startOfToday());
}

export function isWithinInclusiveDay(d: Date, a: Date, b: Date): boolean {
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const aDay = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bDay = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return day >= aDay && day <= bDay;
}

export function nightsBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

export function dateRangeLabel(from: Date, to: Date, locale = 'en-GB'): string {
  const fmt: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return `${from.toLocaleDateString(locale, fmt)} – ${to.toLocaleDateString(
    locale,
    fmt
  )}`;
}

export function parseDotToISO(value: string): string | undefined {
  const match = value.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!match) return undefined;
  const d = Number(match[1]),
    mo = Number(match[2]),
    y = Number(match[3]);
  const dt = new Date(y, mo - 1, d);
  if (
    Number.isNaN(dt.getTime()) ||
    dt.getDate() !== d ||
    dt.getMonth() !== mo - 1
  )
    return undefined;
  const mm = String(mo).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

export function formatDotFromISO(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}
