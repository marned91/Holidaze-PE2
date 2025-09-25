import { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import type { TVenueBooking } from '../../types/venueTypes';
import type { TDateRange } from '../../types/dateTypes';
import {
  parseISOYmd,
  formatISOYmd,
  startOfToday,
  isWithinInclusiveDay,
} from '../../utils/date';

type RangeCalendarProps = {
  value: TDateRange;
  onChange: (next: TDateRange) => void;
  bookings?: TVenueBooking[];
  months?: number;
};

/**
 * Calendar-based date range picker that disables already-booked dates.
 *
 * Behavior:
 * - Uses `react-calendar` with `selectRange` and ISO week settings.
 * - Blocks dates overlapping existing bookings (inclusive of both ends).
 * - Disallows past dates (minDate = today).
 * - Adapts to small screens by collapsing the double-month view.
 * - Emits ISO `yyyy-mm-dd` strings via `onChange`.
 *
 * @param value - Current date range (`{ startDate?: string; endDate?: string }`).
 * @param onChange - Callback invoked when the range changes.
 * @param bookings - Optional booked ranges used to disable days.
 * @param months - Desired month panels (2 by default; 1 on small screens).
 * @returns A responsive calendar range picker.
 */
export function RangeCalendar({
  value,
  onChange,
  bookings = [],
  months = 2,
}: RangeCalendarProps) {
  const startDate = parseISOYmd(value.startDate);
  const endDate = parseISOYmd(value.endDate);
  const today = startOfToday();

  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return false;
    return window.matchMedia('(max-width: 640px)').matches;
  });

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }

    const mediaQueryList = window.matchMedia('(max-width: 640px)');

    setIsSmallScreen(mediaQueryList.matches);

    const handleChange = () => {
      setIsSmallScreen(mediaQueryList.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, []);

  const blockedRanges = useMemo(() => {
    const ranges =
      (bookings
        ?.map((booking) => {
          const start = parseISOYmd(booking.dateFrom?.split('T')[0]);
          const end = parseISOYmd(booking.dateTo?.split('T')[0]);
          return start && end ? { start, end } : null;
        })
        .filter(Boolean) as { start: Date; end: Date }[]) ?? [];
    return ranges;
  }, [bookings]);

  const selectedValue =
    startDate && endDate
      ? ([startDate, endDate] as [Date, Date])
      : startDate ?? undefined;

  return (
    <div>
      <Calendar
        aria-label="Date range calendar"
        locale="en-GB"
        calendarType="iso8601"
        selectRange
        showDoubleView={months >= 2 && !isSmallScreen}
        minDate={today}
        prev2Label={null}
        next2Label={null}
        className="w-full"
        value={selectedValue}
        onChange={(nextValue) => {
          if (Array.isArray(nextValue)) {
            const [nextStart, nextEnd] = nextValue as [Date, Date];
            onChange({
              startDate: formatISOYmd(nextStart),
              endDate: formatISOYmd(nextEnd),
            });
          } else {
            onChange({
              startDate: formatISOYmd(nextValue as Date),
              endDate: undefined,
            });
          }
        }}
        tileDisabled={({ date, view }) => {
          if (view !== 'month') return false;
          for (const range of blockedRanges) {
            if (isWithinInclusiveDay(date, range.start, range.end)) return true;
          }
          return false;
        }}
      />
    </div>
  );
}
