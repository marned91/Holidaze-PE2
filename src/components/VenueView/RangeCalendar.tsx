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
 * @remarks
 * - Uses `react-calendar` with `selectRange`.
 * - Blocks dates overlapping existing bookings (inclusive).
 * - No functional or styling changes were made.
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
