import type { TDateRange } from '../types/dateType';
import type { TVenue } from '../types/venueTypes';

export function todayYmd(): string {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, '0');
  const d = String(n.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseLocal(ymd?: string): Date | null {
  if (!ymd) return null;
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
  return isNaN(dt.getTime()) ? null : dt;
}

export function normalizeDateRange(
  range: TDateRange
): { from: Date; to: Date } | null {
  const from = parseLocal(range.startDate);
  const to = parseLocal(range.endDate);
  if (!from || !to) return null;
  if (from.getTime() > to.getTime()) return null;
  return { from, to };
}

export function rangesOverlapInclusive(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return (
    aStart.getTime() <= bEnd.getTime() && bStart.getTime() <= aEnd.getTime()
  );
}

export function isVenueAvailableForRange(
  venue: Pick<TVenue, 'bookings'>,
  wanted: { from: Date; to: Date }
): boolean {
  const bookings = venue.bookings ?? [];
  if (bookings.length === 0) return true;

  return bookings.every((b) => {
    const bs = parseLocal(b.dateFrom?.split('T')[0] ?? '');
    const be = parseLocal(b.dateTo?.split('T')[0] ?? '');
    if (!bs || !be) return true;
    return !rangesOverlapInclusive(wanted.from, wanted.to, bs, be);
  });
}
