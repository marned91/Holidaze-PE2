import { useMemo, useState } from 'react';
import { DateRangeFields } from '../Common/DateRangeFields';
import { FaTimes } from 'react-icons/fa';
import { formatDotFromISO } from '../../utils/date';
import type { TDateRange } from '../../types/dateType';

type VenuesFiltersProps = {
  cities: string[];
  selectedCity: string | null;
  onCityChange: (nextCity: string | null) => void;

  minGuests: number | null;
  onMinGuestsChange: (nextMinGuests: number | null) => void;

  dateRange: TDateRange;
  onDateRangeChange: (nextDateRange: TDateRange) => void;
};

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
  const [startDraft, setStartDraft] = useState<string>(
    dateRange.startDate ?? ''
  );
  const [endDraft, setEndDraft] = useState<string>(dateRange.endDate ?? '');

  const cityList = useMemo(() => cities.filter(Boolean), [cities]);

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
    const parsed =
      guestsDraft.trim() === '' ? null : Math.max(1, Number(guestsDraft));
    onMinGuestsChange(
      Number.isFinite(parsed as number) ? (parsed as number) : null
    );
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
    'relative inline-flex items-center gap-3 rounded-full border px-4 py-2 shadow-sm transition-colors';
  const inactiveButton = `${baseButton} border-gray-300 bg-white hover:bg-gray-50`;
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
          className="fixed inset-0 z-[70] bg-transparent cursor-default"
        />
      )}
      <div className="relative flex flex-wrap justify-center gap-3">
        <div
          className={`relative inline-block ${isCityOpen ? 'z-[80]' : 'z-10'}`}
        >
          <button
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
          >
            <span>{cityLabel}</span>
            {selectedCity && (
              <button
                type="button"
                aria-label="Clear city filter"
                onClick={(event) => {
                  event.stopPropagation();
                  clearCity();
                }}
                className="ml-1 grid h-5 w-5 place-items-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            )}
          </button>
          {isCityOpen && (
            <div className={popoverPanelClass}>
              <div className="max-h-60 overflow-auto">
                <button
                  type="button"
                  onClick={() => setCityDraft(null)}
                  className={`mb-2 w-full rounded-md px-2 py-1 text-left ${
                    cityDraft == null ? 'bg-gray-100' : 'hover:bg-gray-50'
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
                      cityDraft === cityName
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
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
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyCity}
                  className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
        <div
          className={`relative inline-block ${
            isGuestsOpen ? 'z-[80]' : 'z-10'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              const willOpen = !isGuestsOpen;
              if (willOpen)
                setGuestsDraft(minGuests != null ? String(minGuests) : '');
              if (willOpen) openOnly('guests');
              else closeAll();
            }}
            className={minGuests != null ? activeButton : inactiveButton}
            aria-haspopup="dialog"
            aria-expanded={isGuestsOpen}
          >
            <span>{guestsLabel}</span>
            {minGuests != null && (
              <button
                type="button"
                aria-label="Clear guests filter"
                onClick={(event) => {
                  event.stopPropagation();
                  clearGuests();
                }}
                className="ml-1 grid h-5 w-5 place-items-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            )}
          </button>
          {isGuestsOpen && (
            <div className={popoverPanelClass}>
              <label
                htmlFor="guests-input"
                className="mb-1 block text-sm text-gray-700"
              >
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
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 outline-none focus:ring-2 focus:ring-highlight"
              />
              <div className="mt-3 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={closeAll}
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyGuests}
                  className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
        <div
          className={`relative inline-block ${isDatesOpen ? 'z-[80]' : 'z-10'}`}
        >
          <button
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
            className={
              dateRange.startDate || dateRange.endDate
                ? activeButton
                : inactiveButton
            }
            aria-haspopup="dialog"
            aria-expanded={isDatesOpen}
          >
            <span>{datesLabel}</span>
            {(dateRange.startDate || dateRange.endDate) && (
              <button
                type="button"
                aria-label="Clear dates filter"
                onClick={(event) => {
                  event.stopPropagation();
                  clearDates();
                }}
                className="ml-1 grid h-5 w-5 place-items-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            )}
          </button>
          {isDatesOpen && (
            <div className={popoverPanelClass}>
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
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyDates}
                  className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight"
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
