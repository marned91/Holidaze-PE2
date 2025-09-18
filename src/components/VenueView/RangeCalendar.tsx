import { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import type { TVenueBooking } from '../../types/venueTypes';
import type { TDateRange } from '../../types/dateType';
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

export function RangeCalendar({
  value,
  onChange,
  bookings = [],
  months = 2,
}: RangeCalendarProps) {
  const startDate = parseISOYmd(value.startDate);
  const endDate = parseISOYmd(value.endDate);
  const today = startOfToday();

  // --- Gjør doubleView responsivt: slå helt av på små skjermer ---
  // Breakpoint matcher Tailwind “sm”: 640px
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
    )
      return;

    const mediaQueryList: MediaQueryList =
      window.matchMedia('(max-width: 640px)');

    const handleMediaQueryChange = (
      event: MediaQueryListEvent | MediaQueryList
    ) => {
      const matches =
        'matches' in event ? event.matches : (event as MediaQueryList).matches;
      setIsSmallScreen(matches);
    };

    handleMediaQueryChange(mediaQueryList);

    // Moderne nettlesere
    if ('addEventListener' in mediaQueryList) {
      mediaQueryList.addEventListener(
        'change',
        handleMediaQueryChange as unknown as EventListener
      );
      return () =>
        mediaQueryList.removeEventListener(
          'change',
          handleMediaQueryChange as unknown as EventListener
        );
    }

    // Safari < 14 fallback
    // @ts-expect-error: eldre Safari API
    mediaQueryList.addListener(handleMediaQueryChange);
    return () => {
      // @ts-expect-error: eldre Safari API
      mediaQueryList.removeListener(handleMediaQueryChange);
    };
  }, []);

  // Blokkerte intervaller (utilgjengelige datoer)
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

  // Verdi til react-calendar
  const selectedValue =
    startDate && endDate
      ? ([startDate, endDate] as [Date, Date])
      : startDate ?? undefined;

  return (
    <div>
      <Calendar
        locale="en-GB"
        calendarType="iso8601"
        selectRange
        // Av double view på små skjermer:
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
