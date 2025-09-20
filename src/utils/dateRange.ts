import type { TDateRange } from '../types/dateType';
import type { TVenue } from '../types/venueTypes';

export type DateRangeNormalized = { from: Date; to: Date };

export function todayYmd(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocal(ymd?: string): Date | null {
  if (!ymd) return null;
  const [year, month, day] = ymd.split('-').map(Number);
  if (!year || !month || !day) return null;

  const dateObject = new Date(year, month - 1, day, 0, 0, 0, 0);
  return Number.isNaN(dateObject.getTime()) ? null : dateObject;
}

export function normalizeDateRange(
  range: TDateRange
): DateRangeNormalized | null {
  const from = parseLocal(range.startDate);
  const to = parseLocal(range.endDate);
  if (!from || !to) return null;
  if (from.getTime() > to.getTime()) return null;
  return { from, to };
}

export function rangesOverlapInclusive(
  rangeAStart: Date,
  rangeAEnd: Date,
  rangeBStart: Date,
  rangeBEnd: Date
): boolean {
  return (
    rangeAStart.getTime() <= rangeBEnd.getTime() &&
    rangeBStart.getTime() <= rangeAEnd.getTime()
  );
}

export function isVenueAvailableForRange(
  venue: Pick<TVenue, 'bookings'>,
  wanted: DateRangeNormalized
): boolean {
  const bookings = venue.bookings ?? [];
  if (bookings.length === 0) return true;

  return bookings.every((booking) => {
    const bookingStart = parseLocal(booking.dateFrom?.split('T')[0] ?? '');
    const bookingEnd = parseLocal(booking.dateTo?.split('T')[0] ?? '');
    if (!bookingStart || !bookingEnd) return true;
    return !rangesOverlapInclusive(
      wanted.from,
      wanted.to,
      bookingStart,
      bookingEnd
    );
  });
}
