import { useMemo, useState } from 'react';
import type { TVenue } from '../../types/venues';
import type { TDateRange } from '../../types/date';
import { DateRangeFields } from '../common/DateRangeFields';
import {
  normalizeDateRange,
  isVenueAvailableForRange,
} from '../../utils/dateRange';
import { FaUser } from 'react-icons/fa';

type BookingSidebarProps = {
  venue: TVenue;
  value: TDateRange;
  onChange: (next: TDateRange) => void;
  onRequest?: (range: { from: Date; to: Date }, guests?: number) => void;
  className?: string;
  guestCount?: number;
  onGuestCountChange?: (n: number) => void;
};

export function BookingSidebar({
  venue,
  value,
  onChange,
  onRequest,
  className,
  guestCount,
  onGuestCountChange,
}: BookingSidebarProps) {
  const [localGuests, setLocalGuests] = useState<number>(2);
  const guests = guestCount ?? localGuests;
  const setGuests = (n: number) =>
    onGuestCountChange ? onGuestCountChange(n) : setLocalGuests(n);

  const normalized = useMemo(() => normalizeDateRange(value), [value]);
  const isAvailable = useMemo(
    () => (normalized ? isVenueAvailableForRange(venue, normalized) : null),
    [venue, normalized]
  );

  const nights = useMemo(() => {
    if (!normalized) return 0;
    const ms = normalized.to.getTime() - normalized.from.getTime();
    return Math.max(1, Math.round(ms / 86400000)); // at least 1 night
  }, [normalized]);

  const nightly = typeof venue.price === 'number' ? venue.price : 0;
  const total = nights * nightly;

  const priceText = useMemo(() => {
    return typeof venue.price === 'number'
      ? new Intl.NumberFormat('nb-NO', {
          style: 'currency',
          currency: 'NOK',
          maximumFractionDigits: 0,
        }).format(venue.price)
      : '—';
  }, [venue.price]);

  const totalText = useMemo(() => {
    return new Intl.NumberFormat('nb-NO', {
      style: 'currency',
      currency: 'NOK',
      maximumFractionDigits: 0,
    }).format(total);
  }, [total]);

  const canRequest =
    !!normalized &&
    isAvailable === true &&
    guests >= 1 &&
    (typeof venue.maxGuests === 'number' ? guests <= venue.maxGuests : true);

  const maxGuests = Math.max(
    1,
    typeof venue.maxGuests === 'number' ? venue.maxGuests : 10
  );
  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);

  return (
    <aside className={className}>
      <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-2xl font-semibold font-medium-buttons">Book Now</h3>

        <div className="mt-2 text-lg font-text">
          <span className="font-semibold">{priceText}</span>
          <span className="text-gray-600"> / Night</span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-gray-700 font-text">
          <FaUser className="text-gray-600" />
          <span>
            {guests} {guests === 1 ? 'guest' : 'guests'}
          </span>
        </div>

        <div className="mt-4 font-text">
          <DateRangeFields
            value={value}
            onChange={onChange}
            variant="native"
            labelFrom="Start date"
            labelTo="End date"
          />
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm text-gray-700 font-text">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight font-text"
          >
            {guestOptions.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>

          {typeof venue.maxGuests === 'number' && guests > venue.maxGuests && (
            <p className="mt-2 text-xs text-red-600">
              Max {venue.maxGuests} guests for this venue.
            </p>
          )}
        </div>

        {normalized && isAvailable === true && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 font-text">
            Available for the selected dates.
          </p>
        )}
        {normalized && isAvailable === false && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 font-text">
            Not available for the selected dates.
          </p>
        )}

        {normalized && isAvailable === true && (
          <div className="mt-4 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-800">
            <div className="flex items-center justify-between">
              <span>
                {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
              <span>
                {priceText} <span className="text-gray-500">/ night</span>
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{totalText}</span>
            </div>
          </div>
        )}

        <button
          type="button"
          disabled={!canRequest}
          onClick={() => normalized && onRequest?.(normalized, guests)}
          className={`mt-6 w-full rounded-2xl py-3 text-white text-lg font-medium font-medium-buttons ${
            canRequest
              ? 'bg-main-dark hover:bg-dark-highlight'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Book Now!
        </button>
      </div>
    </aside>
  );
}
