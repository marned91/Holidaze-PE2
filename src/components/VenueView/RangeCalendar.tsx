import { useMemo, useState } from 'react';
import type { TVenueBooking } from '../../types/venues';
import type { TDateRange } from '../../types/date';

function parseISO(ymd?: string): Date | undefined {
  if (!ymd) return undefined;
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return undefined;
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
function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}
function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isBeforeDay(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}
function isWithinInclusive(day: Date, from: Date, to: Date): boolean {
  return day.getTime() >= from.getTime() && day.getTime() <= to.getTime();
}
function monthStart(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function monthLabel(d: Date): string {
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}
function weekDayIndexMon0(date: Date): number {
  const js = date.getDay(); // Sun=0..Sat=6
  return (js + 6) % 7;
}

type Props = {
  value: TDateRange;
  onChange: (next: TDateRange) => void;
  bookings?: TVenueBooking[];
  months?: number;
  className?: string;
};

export function RangeCalendar({
  value,
  onChange,
  bookings,
  months = 2,
  className,
}: Props) {
  const selectedFrom = parseISO(value.startDate);
  const selectedTo = parseISO(value.endDate);

  const today = startOfToday();
  const initialMonth = useMemo(
    () => selectedFrom ?? today,
    [selectedFrom, today]
  );
  const [viewMonth, setViewMonth] = useState<Date>(monthStart(initialMonth));

  const blockedRanges = useMemo(() => {
    const arr = (bookings ?? [])
      .map((b) => {
        const from = parseISO(b.dateFrom?.split('T')[0]);
        const to = parseISO(b.dateTo?.split('T')[0]);
        return from && to ? { from, to } : null;
      })
      .filter(Boolean) as { from: Date; to: Date }[];
    return arr;
  }, [bookings]);

  function isBlocked(day: Date): boolean {
    if (isBeforeDay(day, today)) return true;
    for (const r of blockedRanges) {
      if (isWithinInclusive(day, r.from, r.to)) return true;
    }
    return false;
  }

  function handleDayClick(day: Date) {
    if (isBlocked(day)) return;
    if (!selectedFrom || (selectedFrom && selectedTo)) {
      onChange({ startDate: fmt(day), endDate: undefined });
      return;
    }
    if (selectedFrom && !selectedTo) {
      if (isBeforeDay(day, selectedFrom)) {
        onChange({ startDate: fmt(day), endDate: fmt(selectedFrom) });
      } else {
        onChange({ startDate: fmt(selectedFrom), endDate: fmt(day) });
      }
    }
  }

  // --- Month renderer (arrows always inline with title) ---
  function renderMonthGrid(month: Date, idx: number, total: number) {
    const first = monthStart(month);
    const firstGrid = new Date(
      first.getFullYear(),
      first.getMonth(),
      1 - weekDayIndexMon0(first)
    );
    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      cells.push(
        new Date(
          firstGrid.getFullYear(),
          firstGrid.getMonth(),
          firstGrid.getDate() + i
        )
      );
    }

    return (
      <div className="space-y-2 sm:flex-1 sm:min-w-[360px]">
        {/* Felles header: piler + tittel, på alle skjermstørrelser */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, -1))}
            className={`p-2 rounded-md hover:bg-gray-100 ${
              idx === 0 ? '' : 'invisible'
            }`}
            aria-label="Previous month"
          >
            ←
          </button>
          <div className="text-base sm:text-lg font-semibold">
            {monthLabel(month)}
          </div>
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, +1))}
            className={`p-2 rounded-md hover:bg-gray-100 ${
              idx === total - 1 ? '' : 'invisible'
            }`}
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 text-xs text-gray-500">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
            <div key={d} className="h-8 flex items-center justify-center">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day) => {
            const outside = day.getMonth() !== month.getMonth();
            const blocked = isBlocked(day);

            const isStart = selectedFrom && sameDay(day, selectedFrom);
            const isEnd = selectedTo && sameDay(day, selectedTo);
            const inRange =
              selectedFrom &&
              selectedTo &&
              isWithinInclusive(day, selectedFrom, selectedTo) &&
              !isStart &&
              !isEnd;

            const base =
              'm-1 h-9 w-9 rounded-md text-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-500';
            const color = blocked
              ? 'text-gray-300 line-through cursor-not-allowed'
              : 'hover:bg-gray-100 cursor-pointer';
            const outsideCls = outside ? 'text-gray-300' : '';
            const selectedCls =
              isStart || isEnd
                ? 'text-white bg-main-dark'
                : inRange
                ? 'bg-gray-100'
                : '';

            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={blocked}
                onClick={() => handleDayClick(day)}
                className={`${base} ${color} ${outsideCls} ${selectedCls}`}
                aria-pressed={isStart || isEnd || !!inRange}
                aria-label={day.toDateString()}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Months – full width og jevnt fordelt på desktop */}
      <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:gap-12 w-full">
        {Array.from({ length: Math.max(1, months) }, (_, i) =>
          renderMonthGrid(addMonths(viewMonth, i), i, Math.max(1, months))
        )}
      </div>
    </div>
  );
}
