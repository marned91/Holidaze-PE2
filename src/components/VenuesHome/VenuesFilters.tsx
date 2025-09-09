import { useMemo, useState } from 'react';
import { DateRangeFields } from '../common/DateRangeFields';

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

  function applyCity() {
    onCityChange(cityDraft || null);
    setIsCityOpen(false);
  }
  function clearCity() {
    setCityDraft(null);
    onCityChange(null);
    setIsCityOpen(false);
  }

  function applyGuests() {
    const parsed =
      guestsDraft.trim() === '' ? null : Math.max(1, Number(guestsDraft));
    onMinGuestsChange(
      Number.isFinite(parsed as number) ? (parsed as number) : null
    );
    setIsGuestsOpen(false);
  }
  function clearGuests() {
    setGuestsDraft('');
    onMinGuestsChange(null);
    setIsGuestsOpen(false);
  }

  function applyDates() {
    onDateRangeChange({
      startDate: startDraft || undefined,
      endDate: endDraft || undefined,
    });
    setIsDatesOpen(false);
  }
  function clearDates() {
    setStartDraft('');
    setEndDraft('');
    onDateRangeChange({ startDate: undefined, endDate: undefined });
    setIsDatesOpen(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 mb-4">
      <div className="relative flex flex-wrap gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const willOpen = !isCityOpen;
              setIsCityOpen(willOpen);
              setIsGuestsOpen(false);
              setIsDatesOpen(false);
              if (willOpen) setCityDraft(selectedCity ?? null);
            }}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-50"
          >
            {selectedCity ? `Where: ${selectedCity}` : 'Where to?'}
          </button>
          {isCityOpen && (
            <div className="absolute z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
              <div className="max-h-60 overflow-auto">
                <button
                  type="button"
                  onClick={() => setCityDraft(null)}
                  className={`mb-2 w-full text-left rounded-md px-2 py-1 ${
                    cityDraft == null ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  All Norway
                </button>
                {cityList.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setCityDraft(city)}
                    className={`mb-1 w-full text-left rounded-md px-2 py-1 ${
                      cityDraft === city ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    {city}
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

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const willOpen = !isGuestsOpen;
              setIsGuestsOpen(willOpen);
              setIsCityOpen(false);
              setIsDatesOpen(false);
              if (willOpen)
                setGuestsDraft(minGuests != null ? String(minGuests) : '');
            }}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-50"
          >
            {minGuests != null ? `Guests: ${minGuests}` : 'How many?'}
          </button>

          {isGuestsOpen && (
            <div className="absolute z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
              <label
                htmlFor="guests-input"
                className="block text-sm text-gray-700 mb-1"
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

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const willOpen = !isDatesOpen;
              setIsDatesOpen(willOpen);
              setIsCityOpen(false);
              setIsGuestsOpen(false);
              if (willOpen) {
                setStartDraft(dateRange.startDate ?? '');
                setEndDraft(dateRange.endDate ?? '');
              }
            }}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-50"
          >
            {dateRange.startDate || dateRange.endDate
              ? `Dates: ${dateRange.startDate ?? '…'} → ${
                  dateRange.endDate ?? '…'
                }`
              : 'Select dates'}
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
