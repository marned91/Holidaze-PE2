import { useMemo, useState } from 'react';
import { DateRangeFields } from '../Common/DateRangeFields';
import { FaTimes } from 'react-icons/fa';
import { formatYmdAsDot } from '../../utils/date';

export type DateRange = {
  startDate?: string;
  endDate?: string;
};

type VenuesFiltersProps = {
  cities: string[];
  selectedCity: string | null;
  onCityChange: (nextCity: string | null) => void;

  minGuests: number | null;
  onMinGuestsChange: (nextMinGuests: number | null) => void;

  dateRange: DateRange;
  onDateRangeChange: (nextDateRange: DateRange) => void;
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

  const [cityDraft, setCityDraft] = useState<string | null>(selectedCity);
  const [guestsDraft, setGuestsDraft] = useState<string>(
    minGuests != null ? String(minGuests) : ''
  );
  const [startDraft, setStartDraft] = useState<string>(
    dateRange.startDate ?? ''
  );
  const [endDraft, setEndDraft] = useState<string>(dateRange.endDate ?? '');

  const cityList = useMemo(() => cities.filter(Boolean), [cities]);

  // ---- Helpers ----
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

  // ---- Labels inside buttons ----
  const cityLabel = selectedCity ? `Where: ${selectedCity}` : 'Where to?';
  const guestsLabel = minGuests != null ? `Guests: ${minGuests}` : 'How many?';
  const datesLabel =
    dateRange.startDate || dateRange.endDate
      ? `Dates: ${formatYmdAsDot(dateRange.startDate) || '…'} → ${
          formatYmdAsDot(dateRange.endDate) || '…'
        }`
      : 'Dates';

  // ---- Styles ----
  const baseButton =
    'relative inline-flex items-center gap-3 rounded-full border px-4 py-2 shadow-sm transition-colors';
  const inactiveButton = `${baseButton} border-gray-300 bg-white hover:bg-gray-50`;
  const activeButton = `${baseButton} border-gray-400 bg-gray-50`;

  return (
    <div className="mx-auto mb-4 max-w-6xl px-4">
      <div className="relative flex flex-wrap gap-3">
        {/* City */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => {
              const willOpen = !isCityOpen;
              if (willOpen) setCityDraft(selectedCity ?? null);
              openOnly(willOpen ? 'city' : 'dates');
              if (!willOpen) closeAll();
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
            <div className="absolute z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
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
                  onClick={clearCity}
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  Clear
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

        {/* Guests */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => {
              const willOpen = !isGuestsOpen;
              if (willOpen)
                setGuestsDraft(minGuests != null ? String(minGuests) : '');
              openOnly(willOpen ? 'guests' : 'dates');
              if (!willOpen) closeAll();
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
            <div className="absolute z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
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
                  onClick={clearGuests}
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  Clear
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

        {/* Dates */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => {
              const willOpen = !isDatesOpen;
              if (willOpen) {
                setStartDraft(dateRange.startDate ?? '');
                setEndDraft(dateRange.endDate ?? '');
              }
              openOnly(willOpen ? 'dates' : 'city');
              if (!willOpen) closeAll();
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
            <div className="absolute z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
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
                  variant="native"
                />
              </div>

              <div className="mt-3 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={clearDates}
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={applyDates}
                  className="rounded-md bg-main-dark px-3 py-1 text-sm text-white hover:bg-dark-highlight"
                >
                  Apply
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                (Availability wiring can be added later.)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
