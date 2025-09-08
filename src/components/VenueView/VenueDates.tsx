import { useId, useMemo } from 'react';
import { type TVenueBooking } from '../../types/venues';

export type DateRangeValue = {
  startDate?: string;
  endDate?: string;
};

type VenueDatesProps = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  bookings?: TVenueBooking[];
  className?: string;
};

function parseLocalDateFromYyyyMmDd(dateString?: string): Date | null {
  if (!dateString) return null;
  const [y, m, d] = dateString.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
  return isNaN(dt.getTime()) ? null : dt;
}

function dateRangesOverlapInclusive(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return (
    aStart.getTime() <= bEnd.getTime() && bStart.getTime() <= aEnd.getTime()
  );
}

export function VenueDates({
  value,
  onChange,
  bookings,
  className,
}: VenueDatesProps) {
  const startId = useId();
  const endId = useId();

  const startDateObject = useMemo(
    () => parseLocalDateFromYyyyMmDd(value.startDate),
    [value.startDate]
  );
  const endDateObject = useMemo(
    () => parseLocalDateFromYyyyMmDd(value.endDate),
    [value.endDate]
  );

  const isRangeInvalid =
    !!startDateObject &&
    !!endDateObject &&
    startDateObject.getTime() > endDateObject.getTime();

  const availabilityStatus = useMemo<null | 'available' | 'unavailable'>(() => {
    if (!bookings || bookings.length === 0) {
      if (startDateObject && endDateObject && !isRangeInvalid)
        return 'available';
      return null;
    }
    if (!startDateObject || !endDateObject || isRangeInvalid) return null;

    const hasOverlap = bookings.some((booking) => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      if (isNaN(bookingStart.getTime()) || isNaN(bookingEnd.getTime()))
        return false;
      return dateRangesOverlapInclusive(
        startDateObject,
        endDateObject,
        bookingStart,
        bookingEnd
      );
    });

    return hasOverlap ? 'unavailable' : 'available';
  }, [bookings, startDateObject, endDateObject, isRangeInvalid]);

  return (
    <section className={className ?? ''}>
      <h2 className="text-2xl font-medium">Select dates</h2>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={startId} className="mb-1 block text-sm text-gray-700">
            From
          </label>
          <input
            id={startId}
            type="date"
            value={value.startDate ?? ''}
            onChange={(event) =>
              onChange({ ...value, startDate: event.target.value || undefined })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
          />
        </div>

        <div>
          <label htmlFor={endId} className="mb-1 block text-sm text-gray-700">
            To
          </label>
          <input
            id={endId}
            type="date"
            value={value.endDate ?? ''}
            onChange={(event) =>
              onChange({ ...value, endDate: event.target.value || undefined })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
          />
        </div>
      </div>

      {isRangeInvalid && (
        <p className="mt-2 text-sm text-red-600">
          The end date must be after the start date.
        </p>
      )}

      {!isRangeInvalid &&
        availabilityStatus === 'available' &&
        startDateObject &&
        endDateObject && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Available for the selected dates.
          </p>
        )}

      {!isRangeInvalid && availabilityStatus === 'unavailable' && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Not available for the selected dates.
        </p>
      )}
    </section>
  );
}
