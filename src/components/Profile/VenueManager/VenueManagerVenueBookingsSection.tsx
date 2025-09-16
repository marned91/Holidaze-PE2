import type { TVenue, TVenueBookingExtended } from '../../../types/venueTypes';
import { getVenueImage } from '../../../utils/venue';
import { formatCurrencyNOK } from '../../../utils/currency';

type VenueManagerUpcomingVenueBookingsProps = {
  venues: TVenue[];
  isLoading: boolean;
  errorMessage: string | null;
};

function toIsoDateOnly(input?: string): string {
  return (input || '').slice(0, 10);
}

function nightsBetween(from?: string, to?: string): number {
  if (!from || !to) return 0;
  const a = new Date(from);
  const b = new Date(to);
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function monthKey(isoDate: string) {
  const [y, m] = isoDate.split('-');
  return `${y}-${m}`;
}

function monthHeading(key: string) {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1).toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

export function VenueManagerUpcomingVenueBookings({
  venues,
  isLoading,
  errorMessage,
}: VenueManagerUpcomingVenueBookingsProps) {
  const today = new Date().toISOString().slice(0, 10);

  const upcoming = venues
    .flatMap((venue) => {
      const bookings: TVenueBookingExtended[] = (venue as any)?.bookings ?? [];
      return bookings
        .filter((b) => toIsoDateOnly(b.dateFrom) >= today)
        .map((b) => ({ venue, booking: b }));
    })
    .sort((a, b) =>
      toIsoDateOnly(a.booking.dateFrom).localeCompare(
        toIsoDateOnly(b.booking.dateFrom)
      )
    );

  const grouped = upcoming.reduce<Record<string, typeof upcoming>>(
    (acc, item) => {
      const key = monthKey(toIsoDateOnly(item.booking.dateFrom));
      (acc[key] ||= []).push(item);
      return acc;
    },
    {}
  );

  return (
    <section>
      <h2 className="mb-4 text-3xl font-medium font-medium-buttons">
        Upcoming bookings for your venues
      </h2>
      {isLoading && (
        <ul
          role="list"
          className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-start gap-4 p-5">
              <div className="h-24 w-32 rounded-lg bg-gray-100 animate-pulse" />
              <div className="flex-1">
                <div className="h-5 w-1/3 rounded bg-gray-100 animate-pulse" />
                <div className="mt-2 h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
                <div className="mt-2 h-4 w-1/4 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="ml-auto h-6 w-24 rounded bg-gray-100 animate-pulse" />
            </li>
          ))}
        </ul>
      )}

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      {!isLoading && !errorMessage && upcoming.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-700">No upcoming bookings.</p>
          <p className="text-sm text-gray-500">
            New bookings will show up here.
          </p>
        </div>
      )}

      {!isLoading &&
        !errorMessage &&
        Object.entries(grouped).map(([key, items]) => (
          <section key={key} className="mb-8">
            <h3 className="mb-3 text-xl italic font-small-nav-footer">
              {monthHeading(key)}
            </h3>
            <ul
              role="list"
              className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              {items.map(({ venue, booking }) => {
                const { url, alt } = getVenueImage(venue);
                const from = toIsoDateOnly(booking.dateFrom);
                const to = toIsoDateOnly(booking.dateTo);
                const nights = Math.max(nightsBetween(from, to), 1);
                const guests = booking.guests ?? 0;
                const bookedBy =
                  booking.customer?.name ||
                  booking.customer?.username ||
                  'Unknown';
                const total =
                  booking.totalPrice ??
                  (nights > 0 ? venue.price * nights : venue.price);

                return (
                  <li
                    key={`${venue.id}-${booking.id}`}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5"
                    aria-label={`Booking for ${venue.name} from ${from} to ${to}`}
                  >
                    <div className="shrink-0">
                      <div className="h-24 w-32 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={url}
                          alt={alt}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-base font-medium font-small-nav-footer">
                        {venue.name}
                      </h4>

                      <div className="mt-1 grid grid-cols-1 gap-1 text-sm text-gray-700 sm:grid-cols-2">
                        <div>
                          <span className="text-gray-500">Dates: </span>
                          <span className="font-medium">
                            {from} – {to}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Guests: </span>
                          <span className="font-medium">{guests}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-gray-500">Booked by: </span>
                          <span className="font-medium">{bookedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:ml-auto sm:mt-0">
                      <div className="inline-flex items-center rounded-lg bg-dark px-3 py-1 text-sm font-semibold text-white">
                        {formatCurrencyNOK(Number(total))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
    </section>
  );
}
