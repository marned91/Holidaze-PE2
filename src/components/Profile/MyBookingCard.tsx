import type { TVenue } from '../../types/venueTypes';
import type { TBooking } from '../../types/bookingType';
import { getVenueImage } from '../../utils/venue';
import { formatCurrencyNOK } from '../../utils/currency';

function toIsoDateOnly(input?: string) {
  return (input || '').slice(0, 10);
}

function nightsBetween(from?: string, to?: string): number {
  if (!from || !to) return 0;
  const a = new Date(from);
  const b = new Date(to);
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

type MyBookingCardProps = {
  booking: TBooking;
  venue: TVenue;
  onEdit?: (booking: TBooking, venue: TVenue) => void;
  onCancel?: (booking: TBooking, venue: TVenue) => void;
  disableActions?: boolean;
  totalPriceOverride?: number;
};

export function MyBookingCard({
  booking,
  venue,
  onEdit,
  onCancel,
  disableActions,
  totalPriceOverride,
}: MyBookingCardProps) {
  const from = toIsoDateOnly(booking.dateFrom);
  const to = toIsoDateOnly(booking.dateTo);
  const nights = Math.max(nightsBetween(from, to), 1);
  const total =
    typeof totalPriceOverride === 'number'
      ? totalPriceOverride
      : nights * Number(venue.price || 0);

  const { url, alt } = getVenueImage(venue);

  return (
    <article
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl p-4"
      aria-label={`Booking at ${venue.name} from ${from} to ${to}`}
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
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate text-base font-medium font-small-nav-footer">
          {venue.name}
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-700 font-text">
          <li>
            <span className="text-gray-500">Dates: </span>
            <span className="font-medium">
              {from} – {to}
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

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(booking, venue)}
            disabled={!onEdit || disableActions}
            className="rounded-lg border px-3 py-2 text-sm font-medium-buttons hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Edit booking
          </button>
          <button
            type="button"
            onClick={() => onCancel?.(booking, venue)}
            disabled={!onCancel || disableActions}
            className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium-buttons text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel booking
          </button>
        </div>
      </div>
    </article>
  );
}
