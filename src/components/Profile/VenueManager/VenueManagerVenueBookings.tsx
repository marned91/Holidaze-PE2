import type { TVenue } from '../../../types/venues';
import { getVenueImage } from '../../../utils/venue';
import { formatCurrencyNOK } from '../../../utils/currency';

type VenueManagerUpcomingVenueBookingsProps = {
  venues: TVenue[];
  isLoading: boolean;
  errorMessage: string | null;
};

type BookingLike = {
  id: string;
  dateFrom?: string;
  dateTo?: string;
  guests?: number;
  customer?: { name?: string; username?: string };
  totalPrice?: number;
};

function toIsoDateOnly(input?: string): string {
  return (input || '').slice(0, 10);
}

function daysBetween(from?: string, to?: string): number {
  if (!from || !to) return 0;
  const a = new Date(from);
  const b = new Date(to);
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function VenueManagerUpcomingVenueBookings({
  venues,
  isLoading,
  errorMessage,
}: VenueManagerUpcomingVenueBookingsProps) {
  const today = new Date().toISOString().slice(0, 10);

  const upcoming = venues
    .flatMap((venue) => {
      const bookings: BookingLike[] = (venue as any)?.bookings ?? [];
      return bookings
        .filter((b) => toIsoDateOnly(b.dateFrom) >= today)
        .map((b) => ({ venue, booking: b }));
    })
    .sort((a, b) =>
      toIsoDateOnly(a.booking.dateFrom).localeCompare(
        toIsoDateOnly(b.booking.dateFrom)
      )
    );

  return (
    <section>
      <h1 className="mb-4 text-3xl font-large">
        Upcoming bookings for your venues
      </h1>

      {isLoading && <p>Loading bookings…</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      {!isLoading && !errorMessage && upcoming.length === 0 && (
        <p className="text-sm text-gray-600">No upcoming bookings.</p>
      )}

      {upcoming.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map(({ venue, booking }) => {
            const { url, alt } = getVenueImage(venue);
            const from = toIsoDateOnly(booking.dateFrom);
            const to = toIsoDateOnly(booking.dateTo);
            const nights = daysBetween(from, to);
            const guests = booking.guests ?? 0;
            const bookedBy =
              booking.customer?.name || booking.customer?.username || 'Unknown';
            const total =
              booking.totalPrice ??
              (nights > 0 ? venue.price * nights : venue.price);

            return (
              <article
                key={`${venue.id}-${booking.id}`}
                className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-lg p-4"
              >
                <div className="aspect-[16/10] w-full overflow-hidden rounded-md bg-gray-100">
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

                <h3 className="mt-3 font-medium font-small-nav-footer">
                  {venue.name}
                </h3>

                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  <li>
                    <span className="font-semibold">Dates:</span> {from} – {to}
                  </li>
                  <li>
                    <span className="font-semibold">Guests:</span> {guests}
                  </li>
                  <li>
                    <span className="font-semibold">Price:</span>{' '}
                    {formatCurrencyNOK(Number(total))}
                  </li>
                  <li>
                    <span className="font-semibold">Booked by:</span> {bookedBy}
                  </li>
                </ul>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
