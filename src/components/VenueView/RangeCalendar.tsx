import { useMemo } from 'react';
import Calendar from 'react-calendar';
import type { TVenueBooking } from '../../types/venues';
import type { TDateRange } from '../../types/date';

function parseISO(ymd?: string): Date | undefined {
  if (!ymd) return undefined;
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
  return isNaN(dt.getTime()) ? undefined : dt;
}

function fmt(date?: Date): string | undefined {
  if (!date) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function startOfToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
function inInclusive(d: Date, a: Date, b: Date) {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return t >= a.getTime() && t <= b.getTime();
}

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
  const from = parseISO(value.startDate);
  const to = parseISO(value.endDate);
  const today = startOfToday();

  const blocked = useMemo(() => {
    const list =
      (bookings
        ?.map((b) => {
          const a = parseISO(b.dateFrom?.split('T')[0]);
          const z = parseISO(b.dateTo?.split('T')[0]);
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
            onChange({ startDate: fmt(a), endDate: fmt(z) });
          } else {
            onChange({ startDate: fmt(val as Date), endDate: undefined });
          }
        }}
        tileDisabled={({ date, view }) => {
          if (view !== 'month') return false;
          for (const r of blocked) {
            if (inInclusive(date, r.a, r.z)) return true;
          }
          return false;
        }}
      />
    </div>
  );
}
