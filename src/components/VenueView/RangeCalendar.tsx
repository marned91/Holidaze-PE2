import { useMemo } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import type { TVenueBooking } from '../../types/venues';
import type { DateRangeValue } from './VenueDates';

// Props
type RangeCalendarProps = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  bookings?: TVenueBooking[];
  className?: string;
  numberOfMonths?: number;
  accent?: 'none' | 'light' | 'dark';
};

// parse yyyy-mm-dd -> Date
function parseLocal(date?: string): Date | undefined {
  if (!date) return undefined;
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
  return isNaN(dt.getTime()) ? undefined : dt;
}

// Date -> yyyy-mm-dd
function fmt(date?: Date): string | undefined {
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
  accent = 'none',
}: RangeCalendarProps) {
  const selected: DateRange | undefined = useMemo(
    () => ({
      from: parseLocal(value.startDate),
      to: parseLocal(value.endDate),
    }),
    [value.startDate, value.endDate]
  );

  const disabled = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const pastRule = { before: startOfToday } as const;

    const bookingRules =
      (bookings
        ?.map((b) => {
          const from = parseLocal(b.dateFrom.split('T')[0]);
          const to = parseLocal(b.dateTo.split('T')[0]);
          return from && to ? { from, to } : null;
        })
        .filter(Boolean) as { from: Date; to: Date }[]) ?? [];

    return [pastRule, ...bookingRules];
  }, [bookings]);

  function handleSelect(next: DateRange | undefined) {
    onChange({ startDate: fmt(next?.from), endDate: fmt(next?.to) });
  }

  // accent farger
  const accentBase =
    accent === 'light' ? '#0d87a2' : accent === 'dark' ? '#076276' : '#111827'; // sort fallback

  return (
    <div className={className}>
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        numberOfMonths={numberOfMonths}
        weekStartsOn={1}
        pagedNavigation
        captionLayout="dropdown"
        className="w-full"
        classNames={{
          root: 'w-full text-gray-900',
          months: 'flex flex-col sm:flex-row sm:gap-8 gap-4',
          month: 'space-y-3',
          caption: 'flex items-center justify-between px-1',
          caption_label: 'text-base font-semibold',
          caption_dropdowns: 'flex items-center gap-2',
          nav: 'flex items-center gap-2',
          button_previous: 'p-2 rounded-md hover:bg-gray-100',
          button_next: 'p-2 rounded-md hover:bg-gray-100',
          table: 'w-full border-collapse',
          head_row: 'grid grid-cols-7 text-xs text-gray-500',
          head_cell: 'h-8 flex items-center justify-center',
          row: 'grid grid-cols-7',
          cell: 'h-10 flex items-center justify-center',
          day: 'h-9 w-9 text-sm rounded-md flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500',
          day_outside: 'text-gray-300',
          day_disabled: 'text-gray-300 line-through',
          day_selected: 'text-white',
          day_range_start: 'text-white',
          day_range_end: 'text-white',
          day_range_middle: 'bg-gray-100',
          footer: 'mt-2 text-sm text-gray-600',
        }}
        style={
          {
            '--rdp-accent-color': accentBase,
            '--rdp-background-color': 'rgba(17,24,39,0.06)', // lys grå bakgrunn på range
            '--rdp-selected-color': '#ffffff',
          } as React.CSSProperties
        }
        modifiersClassNames={{
          selected: 'bg-[var(--rdp-accent-color)]',
          range_start: 'bg-[var(--rdp-accent-color)]',
          range_end: 'bg-[var(--rdp-accent-color)]',
          today: 'border border-gray-400 font-medium',
        }}
      />
    </div>
  );
}
