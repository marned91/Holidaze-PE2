// components/Common/DateRangeFields.tsx
import Calendar from 'react-calendar';
import type { Value } from 'react-calendar/dist/shared/types.js';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { TDateRange } from '../../types/dateType';
import {
  parseISOYmd,
  formatISOYmd,
  startOfToday,
  formatDotFromISO,
  parseDotToISO,
  isWithinInclusiveDay,
} from '../../utils/date';

type CalendarView = 'month' | 'year' | 'decade' | 'century';
type TileDisabledArgs = { date: Date; view: CalendarView };

type BookingLike = { dateFrom: string; dateTo: string };

type DateRangeFieldsProps = {
  value: TDateRange;
  onChange: (next: TDateRange) => void;
  className?: string;
  /** use "calendar" to show two inputs with two popovers */
  variant?: 'native' | 'text' | 'calendar';
  labelFrom?: string;
  labelTo?: string;
  bookings?: BookingLike[];
  months?: 1 | 2; // 1 by default for small popover
};

export function DateRangeFields({
  value,
  onChange,
  className,
  variant = 'native',
  labelFrom = 'From',
  labelTo = 'To',
  bookings = [],
  months = 1,
}: DateRangeFieldsProps) {
  const startInputId = useId();
  const endInputId = useId();

  // Common limits for native/text
  const todayISO = formatISOYmd(startOfToday());
  const startMin = todayISO;
  const endMin = value.startDate ?? todayISO;
  const startMax = value.endDate ?? undefined;

  // Build blocked ranges once
  const blockedRanges = useMemo(() => {
    const ranges =
      (bookings
        ?.map((b) => {
          const s = parseISOYmd(b.dateFrom?.split('T')[0]);
          const e = parseISOYmd(b.dateTo?.split('T')[0]);
          return s && e ? { start: s, end: e } : null;
        })
        .filter(Boolean) as { start: Date; end: Date }[]) ?? [];
    return ranges;
  }, [bookings]);

  // Disable rule shared by both popovers
  function tileDisabled({ date, view }: TileDisabledArgs): boolean {
    if (view !== 'month') return false;
    if (date < startOfToday()) return true;
    for (const r of blockedRanges) {
      if (isWithinInclusiveDay(date, r.start, r.end)) return true;
    }
    // Also disallow picking an end date before start (handled in end calendar only below)
    return false;
  }

  // ---------- VARIANT: POPUP CALENDARS (two inputs) ----------
  if (variant === 'calendar') {
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    const startRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
      function onDocClick(event: MouseEvent) {
        if (
          openStart &&
          startRef.current &&
          !startRef.current.contains(event.target as Node)
        ) {
          setOpenStart(false);
        }
        if (
          openEnd &&
          endRef.current &&
          !endRef.current.contains(event.target as Node)
        ) {
          setOpenEnd(false);
        }
      }
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [openStart, openEnd]);

    // Selected values
    const selectedStart = useMemo(
      () => parseISOYmd(value.startDate) ?? null,
      [value.startDate]
    );
    const selectedEnd = useMemo(
      () => parseISOYmd(value.endDate) ?? null,
      [value.endDate]
    );

    // End calendar: also disable days before currently chosen start
    function endTileDisabled(args: TileDisabledArgs): boolean {
      if (tileDisabled(args)) return true;
      if (args.view !== 'month') return false;
      if (selectedStart && args.date < selectedStart) return true;
      return false;
    }

    // Handlers
    function handleStartChange(nextValue: Value): void {
      if (nextValue instanceof Date) {
        const newStart = formatISOYmd(nextValue);
        const currentEnd = value.endDate;
        // If end exists but is now before start, clear end
        const shouldClearEnd =
          currentEnd && parseISOYmd(currentEnd)! < nextValue ? true : false;
        onChange({
          startDate: newStart,
          endDate: shouldClearEnd ? undefined : currentEnd,
        });
        setOpenStart(false);
        // Open the end picker next for convenience
        setOpenEnd(true);
      } else {
        // null or array -> treat as clear
        onChange({ startDate: undefined, endDate: value.endDate });
      }
    }

    function handleEndChange(nextValue: Value): void {
      if (nextValue instanceof Date) {
        onChange({
          startDate: value.startDate,
          endDate: formatISOYmd(nextValue),
        });
        setOpenEnd(false);
      } else {
        onChange({ startDate: value.startDate, endDate: undefined });
      }
    }

    const displayStart = value.startDate
      ? formatDotFromISO(value.startDate)
      : 'dd.mm.yyyy';
    const displayEnd = value.endDate
      ? formatDotFromISO(value.endDate)
      : 'dd.mm.yyyy';

    return (
      <div className={className ?? ''}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Start field */}
          <div ref={startRef} className="relative">
            <label
              htmlFor={startInputId}
              className="mb-1 block text-sm text-gray-700"
            >
              {labelFrom}
            </label>
            <button
              id={startInputId}
              type="button"
              onClick={() => setOpenStart((s) => !s)}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-left outline-none focus:ring-2 focus:ring-highlight font-text"
            >
              {displayStart}
            </button>
            {openStart && (
              <div className="absolute left-0 z-50 mt-2 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                <Calendar
                  // single-date mode for start
                  selectRange={false}
                  calendarType="iso8601"
                  locale="en-GB"
                  minDate={startOfToday()}
                  showDoubleView={months === 2}
                  prev2Label={null}
                  next2Label={null}
                  value={selectedStart}
                  onChange={handleStartChange}
                  tileDisabled={tileDisabled}
                  className={`react-calendar ${
                    months === 2 ? 'react-calendar--doubleView' : ''
                  }`}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        startDate: undefined,
                        endDate: value.endDate,
                      });
                    }}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenStart(false)}
                    className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* End field */}
          <div ref={endRef} className="relative">
            <label
              htmlFor={endInputId}
              className="mb-1 block text-sm text-gray-700"
            >
              {labelTo}
            </label>
            <button
              id={endInputId}
              type="button"
              onClick={() => setOpenEnd((s) => !s)}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-left outline-none focus:ring-2 focus:ring-highlight font-text"
              disabled={!value.startDate} // cannot pick end before start
            >
              {displayEnd}
            </button>
            {openEnd && (
              <div className="absolute left-0 z-50 mt-2 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                <Calendar
                  // single-date mode for end
                  selectRange={false}
                  calendarType="iso8601"
                  locale="en-GB"
                  minDate={startOfToday()}
                  showDoubleView={months === 2}
                  prev2Label={null}
                  next2Label={null}
                  value={selectedEnd}
                  onChange={handleEndChange}
                  tileDisabled={endTileDisabled}
                  className={`react-calendar ${
                    months === 2 ? 'react-calendar--doubleView' : ''
                  }`}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        startDate: value.startDate,
                        endDate: undefined,
                      });
                    }}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenEnd(false)}
                    className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- VARIANTER: NATIVE / TEXT ----------
  return (
    <div className={className ?? ''}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor={startInputId}
            className="mb-1 block text-sm text-gray-700"
          >
            {labelFrom}
          </label>
          {variant === 'native' ? (
            <input
              id={startInputId}
              name="startDate"
              type="date"
              value={value.startDate ?? ''}
              min={startMin}
              max={startMax}
              onChange={(event) =>
                onChange({
                  ...value,
                  startDate: event.target.value || undefined,
                })
              }
              className="w-full rounded-md border bg-gray-100 border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          ) : (
            <input
              id={startInputId}
              name="startDate"
              type="text"
              inputMode="numeric"
              placeholder="dd.mm.yyyy"
              value={formatDotFromISO(value.startDate)}
              onChange={(event) =>
                onChange({
                  ...value,
                  startDate: parseDotToISO(event.target.value),
                })
              }
              pattern="^\\d{1,2}\\.\\d{1,2}\\.\\d{4}$"
              title="Use format dd.mm.yyyy"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          )}
        </div>
        <div>
          <label
            htmlFor={endInputId}
            className="mb-1 block text-sm text-gray-700"
          >
            {labelTo}
          </label>
          {variant === 'native' ? (
            <input
              id={endInputId}
              name="endDate"
              type="date"
              value={value.endDate ?? ''}
              min={endMin}
              onChange={(event) =>
                onChange({ ...value, endDate: event.target.value || undefined })
              }
              className="w-full rounded-md border bg-gray-100 border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          ) : (
            <input
              id={endInputId}
              name="endDate"
              type="text"
              inputMode="numeric"
              placeholder="dd.mm.yyyy"
              value={formatDotFromISO(value.endDate)}
              onChange={(event) =>
                onChange({
                  ...value,
                  endDate: parseDotToISO(event.target.value),
                })
              }
              pattern="^\\d{1,2}\\.\\d{1,2}\\.\\d{4}$"
              title="Use format dd.mm.yyyy"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          )}
        </div>
      </div>
    </div>
  );
}
