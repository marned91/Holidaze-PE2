import { useMemo, useState, useId } from 'react';
import type { TVenue, TVenueBooking } from '../../types/venueTypes';
import type { TDateRange } from '../../types/dateType';
import { DateRangeFields } from '../Common/DateRangeFields';
import {
  normalizeDateRange,
  isVenueAvailableForRange,
} from '../../utils/dateRange';
import { nightsBetween } from '../../utils/date';
import { FaUser } from 'react-icons/fa';
import { formatCurrencyNOK } from '../../utils/currency';
import { getGuestsText } from '../../utils/venue';

type BookingSidebarProps = {
  venue: TVenue;
  value: TDateRange;
  onChange: (next: TDateRange) => void;
  onRequest?: (range: { from: Date; to: Date }, guests?: number) => void;
  guestCount?: number;
  onGuestCountChange?: (n: number) => void;
};

/**
 * Sidebar panel for selecting dates and guests, showing price/total, and submitting a booking request.
 *
 * @remarks
 * - Uses `DateRangeFields` with venue bookings to indicate availability.
 * - Announces availability feedback via `role="status"`/`role="alert"`.
 * - No functional or styling changes were made.
 */
export function BookingSidebar({
  venue,
  value,
  onChange,
  onRequest,
  guestCount,
  onGuestCountChange,
}: BookingSidebarProps) {
  const [localGuests, setLocalGuests] = useState<number>(1);

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
    return nightsBetween(normalized.from, normalized.to);
  }, [normalized]);

  const nightly = typeof venue.price === 'number' ? venue.price : 0;
  const total = nights * nightly;

  const priceText = useMemo(() => {
    return typeof venue.price === 'number'
      ? formatCurrencyNOK(venue.price)
      : '—';
  }, [venue.price]);

  const totalText = useMemo(() => formatCurrencyNOK(total), [total]);

  const canRequest =
    !!normalized &&
    isAvailable === true &&
    guests >= 1 &&
    (typeof venue.maxGuests === 'number' ? guests <= venue.maxGuests : true);

  const maxGuests = Math.max(
    1,
    typeof venue.maxGuests === 'number' ? venue.maxGuests : 10
  );
  const guestOptions = Array.from(
    { length: maxGuests },
    (_, indexNumber) => indexNumber + 1
  );

  const guestsSelectId = useId();

  return (
    <div className="rounded-lg border border-gray-300 p-5 shadow-lg">
      <h2 className="text-2xl font-semibold font-medium-buttons">Book Now</h2>
      <div className="mt-2 text-lg font-text">
        <span className="font-semibold">{priceText}</span>
        <span className="text-gray-600"> / night</span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-gray-700 font-text">
        <FaUser className="text-gray-600" aria-hidden="true" />
        <span>{getGuestsText(guests)}</span>
      </div>
      <div className="mt-4 font-text">
        <DateRangeFields
          value={value}
          onChange={onChange}
          variant="calendar"
          labelFrom="Start"
          labelTo="End"
          bookings={venue.bookings as unknown as TVenueBooking[]}
          months={1}
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor={guestsSelectId}
          className="mb-1 block text-sm text-gray-700 font-text"
        >
          Guests
        </label>
        <select
          id={guestsSelectId}
          value={guests}
          onChange={(event) => setGuests(Number(event.target.value))}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight font-text"
        >
          {guestOptions.map((guestNumber) => (
            <option key={guestNumber} value={guestNumber}>
              {getGuestsText(guestNumber)}
            </option>
          ))}
        </select>
        {typeof venue.maxGuests === 'number' && guests > venue.maxGuests && (
          <p className="mt-2 text-xs text-red-600" role="alert">
            Max {venue.maxGuests} guests for this venue.
          </p>
        )}
      </div>
      {normalized && isAvailable === true && (
        <p
          className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 font-text"
          role="status"
        >
          Available for the selected dates!
        </p>
      )}
      {normalized && isAvailable === false && (
        <p
          className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 font-text"
          role="alert"
        >
          Not available for the selected dates.
        </p>
      )}
      {normalized && isAvailable === true && (
        <div className="mt-4 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-800 font-text">
          <div className="flex items-center justify-between">
            <span>
              {nights} {nights === 1 ? 'night' : 'nights'}
            </span>
            <span>
              {priceText} <span className="text-gray-500">/ night</span>
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between font-semibold font-text text-lg">
            <span>Total</span>
            <span>{totalText}</span>
          </div>
        </div>
      )}
      <button
        type="button"
        disabled={!canRequest}
        aria-disabled={!canRequest}
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
  );
}
