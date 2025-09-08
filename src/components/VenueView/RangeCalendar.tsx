import { useMemo } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import type { TVenueBooking } from '../../types/venues';
import type { DateRangeValue } from './VenueDates';

type RangeCalendarProps = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  bookings?: TVenueBooking[];
  className?: string;
  numberOfMonths?: number;
};

function parseLocal(date?: string): Date | undefined {
  if (!date) return undefined;
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
  return isNaN(dt.getTime()) ? undefined : dt;
}

function formatYyyyMmDd(date?: Date): string | undefined {
  if (!date) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function RangeCalendar({
  value,
  onChange,
  bookings,
  className,
  numberOfMonths = 2,
}: RangeCalendarProps) {
  const selected: DateRange | undefined = useMemo(
    () => ({
      from: parseLocal(value.startDate),
      to: parseLocal(value.endDate),
    }),
    [value.startDate, value.endDate]
  );

  const disabled = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const pastRule = { before: today } as const;
    const bookingRules =
      (bookings
        ?.map((b) => {
          const fromStr = b.dateFrom.split('T')[0];
          const toStr = b.dateTo.split('T')[0];
          const from = parseLocal(fromStr);
          const to = parseLocal(toStr);
          if (!from || !to) return null;
          return { from, to };
        })
        .filter(Boolean) as { from: Date; to: Date }[]) ?? [];

    return [pastRule, ...bookingRules];
  }, [bookings]);

  function handleSelect(next: DateRange | undefined) {
    onChange({
      startDate: formatYyyyMmDd(next?.from),
      endDate: formatYyyyMmDd(next?.to),
    });
  }

  return (
    <div className={className}>
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        numberOfMonths={numberOfMonths}
        disabled={disabled}
        captionLayout="dropdown"
        pagedNavigation
        weekStartsOn={1}
      />
    </div>
  );
}
