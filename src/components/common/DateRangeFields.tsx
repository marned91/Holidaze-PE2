// components/Common/DateRangeFields.tsx
import Calendar from 'react-calendar';
import type { Value } from 'react-calendar/dist/shared/types.js';
import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import { createPortal } from 'react-dom';
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
  /** 'calendar' = to separate inputs med små popovers */
  variant?: 'native' | 'text' | 'calendar';
  labelFrom?: string;
  labelTo?: string;
  bookings?: BookingLike[];
  months?: 1 | 2; // 1 som standard for kompakt popover
};

/** Popover i portal: flipper opp/ned etter plass, klemmer høyde til viewport */
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

  useLayoutEffect(() => {
    function updatePosition() {
      if (!anchor) return;

      const anchorRect = anchor.getBoundingClientRect();
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;

      const margin = 8; // luft mellom felt og popover
      const wantedMinHeight = 320; // “ønsket” min høyde for kalender
      const spaceBelow = viewportHeight - (anchorRect.bottom + margin);
      const spaceAbove = anchorRect.top - margin;

      // Plasser over hvis for lite plass under og bedre plass over
      const placeAbove =
        spaceBelow < wantedMinHeight && spaceAbove > spaceBelow;

      // Maks høyde vi faktisk kan bruke (med litt buffer)
      const availableHeight = Math.max(
        160,
        (placeAbove ? spaceAbove : spaceBelow) - 8
      );

      // Horisontal plassering – ikke gå utenfor skjermen
      const leftPos =
        align === 'left'
          ? Math.max(8, Math.min(anchorRect.left, viewportWidth - 16))
          : undefined;
      const rightPos =
        align === 'right'
          ? Math.max(8, viewportWidth - anchorRect.right)
          : undefined;

      setStyle({
        position: 'fixed',
        top: placeAbove ? undefined : anchorRect.bottom + margin,
        bottom: placeAbove
          ? viewportHeight - anchorRect.top + margin
          : undefined,
        left: leftPos,
        right: rightPos,
        zIndex: 9999,
        maxHeight: availableHeight, // klem høyde
        overflowY: 'auto', // scroll inni popover
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 'env(safe-area-inset-bottom)', // iOS-safe area
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
    document.body
  );
}

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

  // Felles for native/text
  const todayISO = formatISOYmd(startOfToday());
  const startMin = todayISO;
  const endMin = value.startDate ?? todayISO;
  const startMax = value.endDate ?? undefined;

  // For blokkering i kalender
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

  function baseTileDisabled({ date, view }: TileDisabledArgs): boolean {
    if (view !== 'month') return false;
    if (date < startOfToday()) return true;
    for (const r of blockedRanges) {
      if (isWithinInclusiveDay(date, r.start, r.end)) return true;
    }
    return false;
  }

  // ---------- VARIANT: to popover-kalendere ----------
  if (variant === 'calendar') {
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);

    const startButtonRef = useRef<HTMLButtonElement | null>(null);
    const endButtonRef = useRef<HTMLButtonElement | null>(null);
    const popoverContentRef = useRef<HTMLDivElement | null>(null);

    // Lukking ved klikk utenfor (anchor + popover)
    useEffect(() => {
      function onDocMouseDown(event: MouseEvent) {
        const target = event.target as Node;
        const inStart = startButtonRef.current?.contains(target) ?? false;
        const inEnd = endButtonRef.current?.contains(target) ?? false;
        const inPopover = popoverContentRef.current?.contains(target) ?? false;
        const clickedAnchor = inStart || inEnd;
        if (!clickedAnchor && !inPopover) {
          setOpenStart(false);
          setOpenEnd(false);
        }
      }
      document.addEventListener('mousedown', onDocMouseDown);
      return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, []);

    // Verdier
    const selectedStart = useMemo(
      () => parseISOYmd(value.startDate) ?? null,
      [value.startDate]
    );
    const selectedEnd = useMemo(
      () => parseISOYmd(value.endDate) ?? null,
      [value.endDate]
    );

    // End: i tillegg blokker datoer før valgt start
    function endTileDisabled(args: TileDisabledArgs): boolean {
      if (baseTileDisabled(args)) return true;
      if (args.view !== 'month') return false;
      if (selectedStart && args.date < selectedStart) return true;
      return false;
    }

    // Handlers (single-date per felt)
    function handleStartChange(nextValue: Value): void {
      if (nextValue instanceof Date) {
        const nextStartISO = formatISOYmd(nextValue);
        const currentEndISO = value.endDate;
        const shouldClearEnd =
          currentEndISO && parseISOYmd(currentEndISO)! < nextValue;
        onChange({
          startDate: nextStartISO,
          endDate: shouldClearEnd ? undefined : currentEndISO,
        });
        setOpenStart(false);
        setOpenEnd(true); // åpne end for kjapp viderevalg
      } else {
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
          {/* Start */}
          <div>
            <label
              htmlFor={startInputId}
              className="mb-1 block text-sm text-gray-700"
            >
              {labelFrom}
            </label>
            <button
              id={startInputId}
              type="button"
              ref={startButtonRef}
              onClick={() => {
                setOpenEnd(false);
                setOpenStart((s) => !s);
              }}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-left outline-none focus:ring-2 focus:ring-highlight font-text"
            >
              {displayStart}
            </button>

            {openStart && (
              <PopoverPortal anchor={startButtonRef.current} align="left">
                <div
                  ref={popoverContentRef}
                  className="rounded-xl border border-gray-200 bg-white p-2 shadow-2xl"
                >
                  <Calendar
                    selectRange={false}
                    calendarType="iso8601"
                    locale="en-GB"
                    minDate={startOfToday()}
                    showDoubleView={months === 2}
                    prev2Label={null}
                    next2Label={null}
                    value={selectedStart}
                    onChange={handleStartChange}
                    tileDisabled={baseTileDisabled}
                    className={`react-calendar ${
                      months === 2 ? 'react-calendar--doubleView' : ''
                    }`}
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
              </PopoverPortal>
            )}
          </div>

          {/* End */}
          <div>
            <label
              htmlFor={endInputId}
              className="mb-1 block text-sm text-gray-700"
            >
              {labelTo}
            </label>
            <button
              id={endInputId}
              type="button"
              ref={endButtonRef}
              onClick={() => {
                setOpenStart(false);
                setOpenEnd((s) => !s);
              }}
              disabled={!value.startDate}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-left outline-none focus:ring-2 focus:ring-highlight font-text disabled:opacity-60"
            >
              {displayEnd}
            </button>

            {openEnd && (
              <PopoverPortal anchor={endButtonRef.current} align="left">
                <div
                  ref={popoverContentRef}
                  className="rounded-xl border border-gray-200 bg-white p-2 shadow-2xl"
                >
                  <Calendar
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
                      onClick={() =>
                        onChange({
                          startDate: value.startDate,
                          endDate: undefined,
                        })
                      }
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
              </PopoverPortal>
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
