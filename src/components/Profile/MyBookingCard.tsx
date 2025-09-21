import type { TVenue } from '../../types/venueTypes';
import type { TBooking } from '../../types/bookingType';
import { getVenueImage } from '../../utils/venue';
import { formatCurrencyNOK } from '../../utils/currency';
import { parseISOYmd, nightsBetween } from '../../utils/date';

/** Returns only YYYY-MM-DD part of an ISO datetime string. */
function toIsoDateOnly(input?: string) {
  return (input || '').slice(0, 10);
}

type MyBookingCardProps = {
  booking: TBooking;
  venue: TVenue;
  onEdit?: (booking: TBooking, venue: TVenue) => void;
  onCancel?: (booking: TBooking, venue: TVenue) => void;
  disableActions?: boolean;
  totalPriceOverride?: number;
  isCancelling?: boolean;
  hideActions?: boolean;
};

/**
 * Card showing a user's booking with dates, guests and total price.
 *
 * Behavior:
 * - Computes nights using `parseISOYmd` + `nightsBetween` to avoid TZ issues.
 * - Falls back to 1 night when dates are missing/invalid.
 */
export function MyBookingCard({
  booking,
  venue,
  onEdit,
  onCancel,
  disableActions,
  totalPriceOverride,
  isCancelling,
  hideActions,
}: MyBookingCardProps) {
  const fromYmd = toIsoDateOnly(booking.dateFrom);
  const toYmd = toIsoDateOnly(booking.dateTo);

  // Safe date math (no `new Date('YYYY-MM-DD')`)
  const fromDate = parseISOYmd(fromYmd);
  const toDate = parseISOYmd(toYmd);
  const nights =
    fromDate && toDate ? Math.max(1, nightsBetween(fromDate, toDate)) : 1;

  const total =
    typeof totalPriceOverride === 'number'
      ? totalPriceOverride
      : nights * Number(venue.price || 0);

  const { url, alt } = getVenueImage(venue);

  return (
    <article
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl p-2 md:p-4"
      aria-label={`Booking at ${venue.name} from ${fromYmd} to ${toYmd}`}
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {url ? (
          <img
            src={url}
            alt={alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full font-text items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-lg font-small-nav-footer font-medium">
          {venue.name}
        </h4>
        <ul className="mt-2 space-y-1 text-sm text-gray-700 font-text">
          <li>
            <span className="text-gray-500">Dates: </span>
            <span className="font-medium">
              {fromYmd} – {toYmd}
            </span>
          </li>
          <li>
            <span className="text-gray-500">Guests: </span>
            <span className="font-medium">{booking.guests}</span>
          </li>
          <li>
            <span className="text-gray-500">Price: </span>
            <span className="font-semibold">{formatCurrencyNOK(total)}</span>
          </li>
        </ul>
        {!hideActions && (
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => onEdit?.(booking, venue)}
              disabled={!onEdit || disableActions || isCancelling}
              className="rounded-lg border px-3 py-1.5 text-sm transition duration-300 ease-out hover:scale-105 font-medium-buttons hover:bg-gray-50 cursor-pointer"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onCancel?.(booking, venue)}
              disabled={!onCancel || disableActions || isCancelling}
              aria-busy={isCancelling || undefined}
              className={`rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 transition duration-300 ease-out hover:scale-105 font-medium-buttons hover:bg-gray-50 cursor-pointer ${
                isCancelling ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isCancelling ? 'Cancelling…' : 'Cancel'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
