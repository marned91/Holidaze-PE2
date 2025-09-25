import Calendar from 'react-calendar';
import type { Value } from 'react-calendar/dist/shared/types.js';
import React, { useEffect, useId, useMemo, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import type { TDateRange } from '../../types/dateTypes';
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
  variant?: 'native' | 'text' | 'calendar';
  labelFrom?: string;
  labelTo?: string;
  bookings?: BookingLike[];
  months?: 1 | 2;
};

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 * Prevents React hydration/SSR warnings when measuring layout.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Lightweight portal that positions a popover anchored to an element.
 *
 * Behavior:
 * - Positions relative to the `anchor` with viewport-aware flipping.
 * - Computes a max height and enables scrolling within the popover.
 * - Repositions on resize/scroll (including `visualViewport`), cleans up on unmount.
 *
 * @param anchor - DOM element the popover should align to (or null before mount).
 * @param align - Horizontal alignment relative to the anchor ("left" | "right").
 * @param children - Popover contents to render in a fixed-position portal.
 * @returns A portal container for the popover.
 */
function PopoverPortal({
  anchor,
  align = 'left',
  children,
}: {
  anchor: HTMLElement | null;
  align?: 'left' | 'right';
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    opacity: 0,
  });

  useIsomorphicLayoutEffect(() => {
    function updatePosition() {
      if (!anchor) return;

      const anchorRect = anchor.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;

      const margin = 8;
      const wantedMinHeight = 320;
      const spaceBelow = viewportHeight - (anchorRect.bottom + margin);
      const spaceAbove = anchorRect.top - margin;

      const placeAbove = spaceBelow < wantedMinHeight && spaceAbove > spaceBelow;

      const availableHeight = Math.max(160, (placeAbove ? spaceAbove : spaceBelow) - 8);

      const leftPos =
        align === 'left' ? Math.max(8, Math.min(anchorRect.left, viewportWidth - 16)) : undefined;
      const rightPos =
        align === 'right' ? Math.max(8, viewportWidth - anchorRect.right) : undefined;

      setStyle({
        position: 'fixed',
        top: placeAbove ? undefined : anchorRect.bottom + margin,
        bottom: placeAbove ? viewportHeight - anchorRect.top + margin : undefined,
        left: leftPos,
        right: rightPos,
        zIndex: 9999,
        maxHeight: availableHeight,
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 'env(safe-area-inset-bottom)',
        opacity: 1,
      });
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    window.visualViewport?.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      window.visualViewport?.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('scroll', updatePosition);
    };
  }, [anchor, align]);

  return createPortal(
    <div ref={wrapperRef} style={style} className="rc-popover">
      {children}
    </div>,
    typeof document !== 'undefined' ? document.body : (null as any)
  );
}

/**
 * Calendar-driven variant of a dual date picker for selecting a date range.
 *
 * Behavior:
 * - Disables past days and dates covered by existing `bookings`.
 * - Forces end date ≥ start date and auto-opens the end picker after start selection.
 * - Supports single- or double-month view via `months`.
 *
 * @param value - Current date range (`startDate`/`endDate` in ISO yyyy-mm-dd).
 * @param onChange - Callback invoked with the next date range.
 * @param labelFrom - Accessible label for the start date button.
 * @param labelTo - Accessible label for the end date button.
 * @param bookings - Existing bookings to block out (inclusive of both ends).
 * @param months - Number of months to show in the calendar (1 or 2).
 * @returns A UI fragment with two trigger buttons and calendar popovers.
 */
function DateRangeFieldsCalendar({
  value,
  onChange,
  labelFrom,
  labelTo,
  bookings = [],
  months = 1,
  className,
}: Pick<
  DateRangeFieldsProps,
  'value' | 'onChange' | 'labelFrom' | 'labelTo' | 'bookings' | 'months' | 'className'
>) {
  const startInputId = useId();
  const endInputId = useId();

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const startButtonRef = useRef<HTMLButtonElement | null>(null);
  const endButtonRef = useRef<HTMLButtonElement | null>(null);
  const popoverContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocumentMouseDown(event: MouseEvent) {
      const targetNode = event.target as Node;
      const inStart = startButtonRef.current?.contains(targetNode) ?? false;
      const inEnd = endButtonRef.current?.contains(targetNode) ?? false;
      const inPopover = popoverContentRef.current?.contains(targetNode) ?? false;
      const clickedAnchor = inStart || inEnd;
      if (!clickedAnchor && !inPopover) {
        setIsStartOpen(false);
        setIsEndOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocumentMouseDown);
    return () => document.removeEventListener('mousedown', onDocumentMouseDown);
  }, []);

  const selectedStartDate = useMemo(() => parseISOYmd(value.startDate) ?? null, [value.startDate]);
  const selectedEndDate = useMemo(() => parseISOYmd(value.endDate) ?? null, [value.endDate]);

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

  /**
   * Base rule for disabling tiles in the calendar.
   * Past days and days intersecting any booked range are disabled.
   *
   * @param param0 - Calendar tile info ({ date, view }).
   * @returns True if the tile should be disabled.
   */
  function isBaseTileDisabled({ date, view }: TileDisabledArgs): boolean {
    if (view !== 'month') return false;
    if (date < startOfToday()) return true;
    for (const range of blockedRanges) {
      if (isWithinInclusiveDay(date, range.start, range.end)) return true;
    }
    return false;
  }

  /**
   * Disables end-date tiles that fall before the currently selected start date.
   * Also inherits all base disable rules (past days & booked ranges).
   *
   * @param params - Calendar tile info ({ date, view }).
   * @returns True if the tile should be disabled.
   */
  function isEndTileDisabled(params: TileDisabledArgs): boolean {
    if (isBaseTileDisabled(params)) return true;
    if (params.view !== 'month') return false;
    if (selectedStartDate && params.date < selectedStartDate) return true;
    return false;
  }

  /**
   * Handles selection of the start date from the calendar.
   *
   * Behavior:
   * - Sets `startDate` to the picked value.
   * - Clears `endDate` if it becomes earlier than the new start.
   * - Closes the start popover and opens the end popover for a smooth flow.
   *
   * @param nextValue - Value from `react-calendar` (Date or nullish).
   */
  function handleStartChange(nextValue: Value): void {
    if (nextValue instanceof Date) {
      const nextStartISO = formatISOYmd(nextValue);
      const currentEndISO = value.endDate;
      const shouldClearEnd = currentEndISO && parseISOYmd(currentEndISO)! < nextValue;
      onChange({
        startDate: nextStartISO,
        endDate: shouldClearEnd ? undefined : currentEndISO,
      });
      setIsStartOpen(false);
      setIsEndOpen(true);
    } else {
      onChange({ startDate: undefined, endDate: value.endDate });
    }
  }

  /**
   * Handles selection of the end date from the calendar.
   *
   * Behavior:
   * - Sets `endDate` to the picked value and closes the popover.
   * - Clears `endDate` when the selection is cleared.
   *
   * @param nextValue - Value from `react-calendar` (Date or nullish).
   */
  function handleEndChange(nextValue: Value): void {
    if (nextValue instanceof Date) {
      onChange({
        startDate: value.startDate,
        endDate: formatISOYmd(nextValue),
      });
      setIsEndOpen(false);
    } else {
      onChange({ startDate: value.startDate, endDate: undefined });
    }
  }

  const displayStartText = value.startDate ? formatDotFromISO(value.startDate) : 'dd.mm.yyyy';
  const displayEndText = value.endDate ? formatDotFromISO(value.endDate) : 'dd.mm.yyyy';

  return (
    <div className={className ?? ''}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={startInputId} className="mb-1 block text-sm text-gray-700 font-text">
            {labelFrom}
          </label>
          <button
            id={startInputId}
            type="button"
            ref={startButtonRef}
            onClick={() => {
              setIsEndOpen(false);
              setIsStartOpen((prev) => !prev);
            }}
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-left outline-none focus:ring-2 focus:ring-highlight font-text"
          >
            {displayStartText}
          </button>
          {isStartOpen && (
            <PopoverPortal anchor={startButtonRef.current} align="left">
              <div
                ref={popoverContentRef}
                className="rounded-xl border border-gray-200 bg-white p-2 shadow-2xl font-text"
              >
                <Calendar
                  selectRange={false}
                  calendarType="iso8601"
                  locale="en-GB"
                  minDate={startOfToday()}
                  showDoubleView={months === 2}
                  prev2Label={null}
                  next2Label={null}
                  value={selectedStartDate}
                  onChange={handleStartChange}
                  tileDisabled={isBaseTileDisabled}
                  className={`react-calendar ${months === 2 ? 'react-calendar--doubleView' : ''}`}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        startDate: undefined,
                        endDate: value.endDate,
                      })
                    }
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 font-medium-buttons"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStartOpen(false)}
                    className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight font-medium-buttons"
                  >
                    Done
                  </button>
                </div>
              </div>
            </PopoverPortal>
          )}
        </div>
        <div>
          <label htmlFor={endInputId} className="mb-1 block text-sm text-gray-700 font-text">
            {labelTo}
          </label>
          <button
            id={endInputId}
            type="button"
            ref={endButtonRef}
            onClick={() => {
              setIsStartOpen(false);
              setIsEndOpen((prev) => !prev);
            }}
            disabled={!value.startDate}
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-left outline-none focus:ring-2 focus:ring-highlight font-text disabled:opacity-60 font-medium-buttons"
          >
            {displayEndText}
          </button>
          {isEndOpen && (
            <PopoverPortal anchor={endButtonRef.current} align="left">
              <div
                ref={popoverContentRef}
                className="rounded-xl border border-gray-200 bg-white p-2 shadow-2xl font-text"
              >
                <Calendar
                  selectRange={false}
                  calendarType="iso8601"
                  locale="en-GB"
                  minDate={startOfToday()}
                  showDoubleView={months === 2}
                  prev2Label={null}
                  next2Label={null}
                  value={selectedEndDate}
                  onChange={handleEndChange}
                  tileDisabled={isEndTileDisabled}
                  className={`react-calendar ${months === 2 ? 'react-calendar--doubleView' : ''}`}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        startDate: value.startDate,
                        endDate: undefined,
                      })
                    }
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 font-medium-buttons"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEndOpen(false)}
                    className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight font-medium-buttons"
                  >
                    Done
                  </button>
                </div>
              </div>
            </PopoverPortal>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Dual date fields with three variants: "native", "text" (dd.mm.yyyy), and a calendar popover.
 *
 * Behavior:
 * - Disables past and booked dates (calendar variant).
 * - Enforces end date ≥ start date.
 * - Delegates the selected range via `onChange`.
 *
 * @param value - Current date range.
 * @param onChange - Callback invoked with the next date range.
 * @param className - Optional wrapper class.
 * @param variant - Input style: "native" | "text" | "calendar".
 * @param labelFrom - Label for the start date input.
 * @param labelTo - Label for the end date input.
 * @param bookings - Existing bookings to block when using the calendar variant.
 * @param months - Number of months to display in the calendar variant.
 * @returns A date range input component.
 */
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

  const todayISO = formatISOYmd(startOfToday());
  const startMin = todayISO;
  const endMin = value.startDate ?? todayISO;
  const startMax = value.endDate ?? undefined;

  if (variant === 'calendar') {
    return (
      <DateRangeFieldsCalendar
        value={value}
        onChange={onChange}
        labelFrom={labelFrom}
        labelTo={labelTo}
        bookings={bookings}
        months={months}
        className={className}
      />
    );
  }

  return (
    <div className={className ?? ''}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={startInputId} className="mb-1 block text-sm text-gray-700">
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
          <label htmlFor={endInputId} className="mb-1 block text-sm text-gray-700">
            {labelTo}
          </label>
          {variant === 'native' ? (
            <input
              id={endInputId}
              name="endDate"
              type="date"
              value={value.endDate ?? ''}
              min={endMin}
              onChange={(event) => onChange({ ...value, endDate: event.target.value || undefined })}
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
