import { useMemo, useState, useId } from 'react';
import { DateRangeFields } from '../Common/DateRangeFields';
import { FaTimes } from 'react-icons/fa';
import { formatDotFromISO } from '../../utils/date';
import type { TDateRange } from '../../types/dateTypes';

type VenuesFiltersProps = {
  cities: string[];
  selectedCity: string | null;
  onCityChange: (nextCity: string | null) => void;

  minGuests: number | null;
  onMinGuestsChange: (nextMinGuests: number | null) => void;

  dateRange: TDateRange;
  onDateRangeChange: (nextDateRange: TDateRange) => void;
};

/**
 * Filter controls for venues (city, minimum guests, and date range).
 *
 * Behavior:
 * - Each filter opens a small popover; only one popover can be open at a time.
 * - Clear icons are keyboard-accessible and marked `aria-hidden` to keep SR output clean.
 * - Popovers are wired with `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`,
 *   and are labeled by their trigger via `aria-labelledby`.
 * - Applies changes via explicit Apply/Cancel buttons; shows current selection in triggers.
 *
 * @param cities - List of available city names.
 * @param selectedCity - Currently selected city, or null for “All Norway”.
 * @param onCityChange - Callback when a new city is applied or cleared.
 * @param minGuests - Minimum guest count, or null when unset.
 * @param onMinGuestsChange - Callback when minimum guests is applied or cleared.
 * @param dateRange - Current date range (ISO yyyy-mm-dd; undefined for empty ends).
 * @param onDateRangeChange - Callback when a new date range is applied or cleared.
 * @returns A row of three filter triggers with corresponding popovers.
 */
export function VenuesFilters({
  cities,
  selectedCity,
  onCityChange,
  minGuests,
  onMinGuestsChange,
  dateRange,
  onDateRangeChange,
}: VenuesFiltersProps) {
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  const isAnyOpen = isCityOpen || isGuestsOpen || isDatesOpen;

  const [cityDraft, setCityDraft] = useState<string | null>(selectedCity);
  const [guestsDraft, setGuestsDraft] = useState<string>(
    minGuests != null ? String(minGuests) : ''
  );
  const [startDraft, setStartDraft] = useState<string>(dateRange.startDate ?? '');
  const [endDraft, setEndDraft] = useState<string>(dateRange.endDate ?? '');

  const cityList = useMemo(() => cities.filter(Boolean), [cities]);

  const cityBtnId = useId();
  const cityPanelId = useId();
  const guestsBtnId = useId();
  const guestsPanelId = useId();
  const datesBtnId = useId();
  const datesPanelId = useId();

  /**
   * Opens exactly one filter popover and closes the others.
   *
   * @param which - Filter key to open ("city" | "guests" | "dates").
   */
  function openOnly(which: 'city' | 'guests' | 'dates') {
    setIsCityOpen(which === 'city');
    setIsGuestsOpen(which === 'guests');
    setIsDatesOpen(which === 'dates');
  }
  function closeAll() {
    setIsCityOpen(false);
    setIsGuestsOpen(false);
    setIsDatesOpen(false);
  }

  function applyCity() {
    onCityChange(cityDraft || null);
    closeAll();
  }
  function clearCity() {
    setCityDraft(null);
    onCityChange(null);
    closeAll();
  }

  function applyGuests() {
    const parsed = guestsDraft.trim() === '' ? null : Math.max(1, Number(guestsDraft));
    onMinGuestsChange(Number.isFinite(parsed as number) ? (parsed as number) : null);
    closeAll();
  }
  function clearGuests() {
    setGuestsDraft('');
    onMinGuestsChange(null);
    closeAll();
  }

  function applyDates() {
    onDateRangeChange({
      startDate: startDraft || undefined,
      endDate: endDraft || undefined,
    });
    closeAll();
  }
  function clearDates() {
    setStartDraft('');
    setEndDraft('');
    onDateRangeChange({ startDate: undefined, endDate: undefined });
    closeAll();
  }

  const cityLabel = selectedCity ? `Where: ${selectedCity}` : 'Where to?';
  const guestsLabel = minGuests != null ? `Guests: ${minGuests}` : 'How many?';
  const datesLabel =
    dateRange.startDate || dateRange.endDate
      ? `Dates: ${formatDotFromISO(dateRange.startDate) || '…'} → ${
          formatDotFromISO(dateRange.endDate) || '…'
        }`
      : 'Select dates';
  const baseButton =
    'relative inline-flex items-center gap-3 rounded-full border px-4 py-2 shadow-sm transition-colors cursor-pointer';
  const inactiveButton = `${baseButton} border-gray-300 shadow-md bg-white hover:bg-gray-50 hover:border-gray-500`;
  const activeButton = `${baseButton} border-gray-400 bg-gray-50`;
  const popoverPanelClass =
    'sm:absolute sm:left-0 sm:top-full sm:mt-2 fixed left-1/2 top-28 -translate-x-1/2 z-[90] w-[min(92vw,22rem)] sm:w-64 max-h-[80vh] overflow-auto overscroll-contain rounded-lg border border-gray-200 bg-white p-3 shadow-lg';

  return (
    <div className="mx-auto mb-4 max-w-6xl px-4 relative">
      {isAnyOpen && (
        <button
          type="button"
          aria-label="Close filters"
          onClick={closeAll}
          className="fixed inset-0 z-[70] bg-transparent cursor-default font-medium-buttons"
        />
      )}
      <div className="relative flex flex-wrap justify-center gap-3 font-text font-medium text-dark">
        <div className={`relative inline-block ${isCityOpen ? 'z-[80]' : 'z-10'}`}>
          <button
            id={cityBtnId}
            type="button"
            onClick={() => {
              const willOpen = !isCityOpen;
              if (willOpen) setCityDraft(selectedCity ?? null);
              if (willOpen) openOnly('city');
              else closeAll();
            }}
            className={selectedCity ? activeButton : inactiveButton}
            aria-haspopup="dialog"
            aria-expanded={isCityOpen}
            aria-controls={cityPanelId}
          >
            <span>{cityLabel}</span>
            {selectedCity && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear city filter"
                onClick={(event) => {
                  event.stopPropagation();
                  clearCity();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    clearCity();
                  }
                }}
                className="ml-1 grid h-5 w-5 place-items-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 font-medium-buttons cursor-pointer"
              >
                <FaTimes className="h-3 w-3" aria-hidden="true" />
              </span>
            )}
          </button>
          {isCityOpen && (
            <div
              id={cityPanelId}
              role="dialog"
              aria-labelledby={cityBtnId}
              className={popoverPanelClass}
            >
              <div className="max-h-60 overflow-auto">
                <button
                  type="button"
                  onClick={() => setCityDraft(null)}
                  className={`mb-2 w-full rounded-md px-2 py-1 text-left ${
                    cityDraft == null ? 'bg-gray-200' : 'hover:bg-gray-200'
                  }`}
                >
                  All Norway
                </button>
                {cityList.map((cityName) => (
                  <button
                    key={cityName}
                    type="button"
                    onClick={() => setCityDraft(cityName)}
                    className={`mb-1 w-full rounded-md px-2 py-1 text-left ${
                      cityDraft === cityName ? 'bg-gray-200' : 'hover:bg-gray-200'
                    }`}
                  >
                    {cityName}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={closeAll}
                  className="rounded-md border px-3 py-1 text-sm cursor-pointer font-medium-buttons hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyCity}
                  className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight font-medium-buttons cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`relative inline-block ${isGuestsOpen ? 'z-[80]' : 'z-10'}`}>
          <button
            id={guestsBtnId}
            type="button"
            onClick={() => {
              const willOpen = !isGuestsOpen;
              if (willOpen) setGuestsDraft(minGuests != null ? String(minGuests) : '');
              if (willOpen) openOnly('guests');
              else closeAll();
            }}
            className={minGuests != null ? activeButton : inactiveButton}
            aria-haspopup="dialog"
            aria-expanded={isGuestsOpen}
            aria-controls={guestsPanelId}
          >
            <span>{guestsLabel}</span>
            {minGuests != null && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear guests filter"
                onClick={(event) => {
                  event.stopPropagation();
                  clearGuests();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    clearGuests();
                  }
                }}
                className="ml-1 grid h-5 w-5 place-items-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 font-medium-buttons cursor-pointer"
              >
                <FaTimes className="h-3 w-3" aria-hidden="true" />
              </span>
            )}
          </button>
          {isGuestsOpen && (
            <div
              id={guestsPanelId}
              role="dialog"
              aria-labelledby={guestsBtnId}
              className={popoverPanelClass}
            >
              <label htmlFor="guests-input" className="mb-1 block text-sm text-gray-700 font-text">
                Minimum guests
              </label>
              <input
                id="guests-input"
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="e.g. 4"
                value={guestsDraft}
                onChange={(event) => setGuestsDraft(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 outline-none focus:ring-2 focus:ring-highlight font-text"
              />
              <div className="mt-3 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={closeAll}
                  className="rounded-md border px-3 py-1 text-sm font-medium-buttons cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyGuests}
                  className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight font-medium-buttons cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`relative inline-block ${isDatesOpen ? 'z-[80]' : 'z-10'}`}>
          <button
            id={datesBtnId}
            type="button"
            onClick={() => {
              const willOpen = !isDatesOpen;
              if (willOpen) {
                setStartDraft(dateRange.startDate ?? '');
                setEndDraft(dateRange.endDate ?? '');
              }
              if (willOpen) openOnly('dates');
              else closeAll();
            }}
            className={dateRange.startDate || dateRange.endDate ? activeButton : inactiveButton}
            aria-haspopup="dialog"
            aria-expanded={isDatesOpen}
            aria-controls={datesPanelId}
          >
            <span>{datesLabel}</span>
            {(dateRange.startDate || dateRange.endDate) && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear dates filter"
                onClick={(event) => {
                  event.stopPropagation();
                  clearDates();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    clearDates();
                  }
                }}
                className="ml-1 grid h-5 w-5 place-items-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 cursor-pointer font-medium-buttons"
              >
                <FaTimes className="h-3 w-3" aria-hidden="true" />
              </span>
            )}
          </button>
          {isDatesOpen && (
            <div
              id={datesPanelId}
              role="dialog"
              aria-labelledby={datesBtnId}
              className={popoverPanelClass}
            >
              <div className="mt-1">
                <DateRangeFields
                  value={{
                    startDate: startDraft || undefined,
                    endDate: endDraft || undefined,
                  }}
                  onChange={(next) => {
                    setStartDraft(next.startDate ?? '');
                    setEndDraft(next.endDate ?? '');
                  }}
                  variant="calendar"
                  months={1}
                />
              </div>
              <div className="mt-3 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={closeAll}
                  className="rounded-md border px-3 py-1 text-sm font-medium-buttons hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyDates}
                  className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight font-medium-buttons cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
