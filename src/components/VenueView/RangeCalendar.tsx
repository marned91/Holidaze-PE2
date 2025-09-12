import { useMemo } from 'react';
import Calendar from 'react-calendar';
import type { TVenueBooking } from '../../types/venues';
import type { TDateRange } from '../../types/date';
import {
  parseISOYmd,
  formatISOYmd,
  startOfToday,
  isWithinInclusiveDay,
} from '../../utils/date';

type Props = {
  value: TDateRange;
  onChange: (next: TDateRange) => void;
  bookings?: TVenueBooking[];
  months?: number; // default 2
};

export function RangeCalendar({
  value,
  onChange,
  bookings,
  months = 2,
}: Props) {
  const from = parseISOYmd(value.startDate);
  const to = parseISOYmd(value.endDate);
  const today = startOfToday();

  const blocked = useMemo(() => {
    const list =
      (bookings
        ?.map((b) => {
          const a = parseISOYmd(b.dateFrom?.split('T')[0]);
          const z = parseISOYmd(b.dateTo?.split('T')[0]);
          return a && z ? { a, z } : null;
        })
        .filter(Boolean) as { a: Date; z: Date }[]) ?? [];
    return list;
  }, [bookings]);

  const rcValue = from && to ? ([from, to] as [Date, Date]) : from ?? undefined;

  return (
    <div>
      <Calendar
        locale="en-GB"
        calendarType="iso8601"
        selectRange
        showDoubleView={months >= 2} // CSS handles stacking on small screens
        minDate={today}
        prev2Label={null}
        next2Label={null}
        className="w-full"
        value={rcValue}
        onChange={(val) => {
          if (Array.isArray(val)) {
            const [a, z] = val as [Date, Date];
            onChange({ startDate: formatISOYmd(a), endDate: formatISOYmd(z) });
          } else {
            onChange({
              startDate: formatISOYmd(val as Date),
              endDate: undefined,
            });
          }
        }}
        tileDisabled={({ date, view }) => {
          if (view !== 'month') return false;
          for (const r of blocked) {
            if (isWithinInclusiveDay(date, r.a, r.z)) return true;
          }
          return false;
        }}
      />
    </div>
  );
}
