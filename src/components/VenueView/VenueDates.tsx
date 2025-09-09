// src/components/VenueView/VenueDates.tsx
import { useMemo } from 'react';
import type { TVenueBooking } from '../../types/venues';
import type { TDateRange } from '../../types/date';
import { RangeCalendarRC as RangeCalendar } from './RangeCalendarRC';
import {
  normalizeDateRange,
  parseLocal,
  rangesOverlapInclusive,
  todayYmd,
} from '../../utils/dateRange';

export type DateRangeValue = TDateRange;

type VenueDatesProps = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  bookings?: TVenueBooking[];
  className?: string;
};

export function VenueDates({
  value,
  onChange,
  bookings,
  className,
}: VenueDatesProps) {
  const today = useMemo(() => todayYmd(), []);
  const normalized = useMemo(() => normalizeDateRange(value), [value]);

  const isStartInPast = !!value.startDate && value.startDate < today;
  const isEndInPast = !!value.endDate && value.endDate < today;
  const isRangeInvalid = !normalized && !!value.startDate && !!value.endDate;

  const availabilityStatus = useMemo<null | 'available' | 'unavailable'>(() => {
    if (!normalized) return null;
    const list = bookings ?? [];
    if (list.length === 0) return 'available';
    const hasOverlap = list.some((b) => {
      const bs = parseLocal(b.dateFrom?.split('T')[0]);
      const be = parseLocal(b.dateTo?.split('T')[0]);
      return (
        bs &&
        be &&
        rangesOverlapInclusive(normalized.from, normalized.to, bs, be)
      );
    });
    return hasOverlap ? 'unavailable' : 'available';
  }, [bookings, normalized]);

  return (
    <section className={className ?? ''}>
      <h2 className="text-2xl font-medium font-medium-buttons">Availability</h2>
      <p className="mt-3 text-xs text-gray-500">
        Click a start date, then an end date. Unavailable and past dates are
        disabled.
      </p>
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4">
        <RangeCalendar
          value={value}
          onChange={onChange}
          bookings={bookings}
          months={2}
          className="w-full"
        />
      </div>

      {isRangeInvalid && (
        <p className="mt-2 text-sm text-red-600">
          The end date must be after the start date.
        </p>
      )}
      {!isRangeInvalid && (isStartInPast || isEndInPast) && (
        <p className="mt-2 text-sm text-red-600">
          Dates in the past are not allowed.
        </p>
      )}
      {!isRangeInvalid &&
        !isStartInPast &&
        !isEndInPast &&
        availabilityStatus === 'available' &&
        normalized && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Available for the selected dates!
          </p>
        )}
      {!isRangeInvalid &&
        !isStartInPast &&
        !isEndInPast &&
        availabilityStatus === 'unavailable' && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Not available for the selected dates.
          </p>
        )}
    </section>
  );
}
