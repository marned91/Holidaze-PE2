import type { TVenue, TVenueBookingExtended } from '../../../types/venueTypes';
import { getVenueImage } from '../../../utils/venue';
import { formatCurrencyNOK } from '../../../utils/currency';
import { todayYmd } from '../../../utils/date';

type UpcomingVenueBookingsProps = {
  venues: TVenue[];
  isLoading: boolean;
  errorMessage: string | null;
};

/**
 * Returns true if the month key (yyyy-mm) equals today's month.
 *
 * @param key - A yyyy-mm string (e.g., "2025-09").
 * @param today - Today's date as yyyy-mm-dd.
 * @returns Whether both represent the same month and year.
 */
function isSameMonthKey(key: string, today: string) {
  return key === today.slice(0, 7);
}

/**
 * Extracts the yyyy-mm-dd portion from an ISO datetime string.
 *
 * @param input - ISO string (date or datetime).
 * @returns ISO date-only string or an empty string if falsy.
 */
function toIsoDateOnly(input?: string): string {
  return (input || '').slice(0, 10);
}

/**
 * Counts nights between two ISO date-only strings.
 * Returns 0 if either input is missing; never negative.
 *
 * @param from - Start date (yyyy-mm-dd).
 * @param to - End date (yyyy-mm-dd).
 * @returns Number of nights between the dates (clamped to ≥ 0).
 */
function nightsBetween(from?: string, to?: string): number {
  if (!from || !to) return 0;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffMs = toDate.getTime() - fromDate.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Converts an ISO date (yyyy-mm-dd) to a month key (yyyy-mm).
 *
 * @param isoDate - ISO date-only input.
 * @returns The yyyy-mm month key.
 */
function monthKey(isoDate: string) {
  const [y, m] = isoDate.split('-');
  return `${y}-${m}`;
}

/**
 * Human-readable month heading for a yyyy-mm key.
 *
 * @param key - Month key (yyyy-mm).
 * @returns Localized month label, e.g. "September 2025".
 */
function monthHeading(key: string) {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1).toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Lists upcoming bookings for the user's venues, grouped by month.
 *
 * Behavior:
 * - Filters out past bookings (keeps bookings with dateFrom ≥ today).
 * - Sorts by start date, groups by month, and expands the current month by default.
 * - Renders loading, error, empty, and populated states with appropriate ARIA roles.
 * - Computes total price from booking.totalPrice when present,
 *   otherwise falls back to nights × venue.price (minimum 1 night).
 *
 * @param venues - Venues including their extended bookings.
 * @param isLoading - Whether data is currently loading.
 * @param errorMessage - Optional error to display.
 * @returns A section rendering grouped upcoming bookings.
 */
export function UpcomingVenueBookings({
  venues,
  isLoading,
  errorMessage,
}: UpcomingVenueBookingsProps) {
  const today = todayYmd();

  type VenueWithExtendedBookings = TVenue & {
    bookings?: TVenueBookingExtended[];
  };
  type UpcomingItem = { venue: TVenue; booking: TVenueBookingExtended };

  const upcoming: UpcomingItem[] = venues
    .flatMap((venue) => {
      const bookings = ((venue as VenueWithExtendedBookings).bookings ??
        []) as TVenueBookingExtended[];
      return bookings
        .filter((booking: TVenueBookingExtended) => toIsoDateOnly(booking.dateFrom) >= today)
        .map((booking: TVenueBookingExtended) => ({ venue, booking }));
    })
    .sort((a, b) =>
      toIsoDateOnly(a.booking.dateFrom).localeCompare(toIsoDateOnly(b.booking.dateFrom))
    );

  const grouped = upcoming.reduce<Record<string, UpcomingItem[]>>((accumulator, item) => {
    const key = monthKey(toIsoDateOnly(item.booking.dateFrom));
    (accumulator[key] ||= []).push(item);
    return accumulator;
  }, {});

  const sectionTitleId = 'upcoming-venue-bookings-title';

  return (
    <section aria-labelledby={sectionTitleId}>
      <h2 id={sectionTitleId} className="mb-4 text-2xl font-medium font-medium-buttons">
        Upcoming bookings for your venues
      </h2>

      {isLoading && (
        <ul
          role="status"
          aria-busy="true"
          aria-live="polite"
          className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index} className="flex items-start gap-4 p-5 font-text">
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

      {errorMessage && (
        <p role="alert" className="text-red-600">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && upcoming.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 px-8 py-14 text-center font-text">
          <p className="text-gray-700 mb-2">No upcoming bookings.</p>
          <p className="text-sm text-gray-500">New bookings for your venues will show up here.</p>
        </div>
      )}

      {!isLoading &&
        !errorMessage &&
        Object.entries(grouped).map(([key, items]) => {
          const monthTitleId = `month-${key}-title`;
          const openByDefault = isSameMonthKey(key, todayYmd());

          return (
            <details
              key={key}
              className="mb-4 rounded-2xl border border-gray-200 bg-white"
              open={openByDefault}
            >
              <summary
                id={monthTitleId}
                className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 hover:bg-gray-50"
                aria-controls={`${monthTitleId}-panel`}
              >
                <span className="text-xl italic font-small-nav-footer">{monthHeading(key)}</span>
                <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
                  {items.length}
                </span>
              </summary>

              <div id={`${monthTitleId}-panel`}>
                <ul role="list" className="divide-y divide-gray-200 border-t border-gray-200">
                  {items.map(({ venue, booking }) => {
                    const { url, alt } = getVenueImage(venue);
                    const from = toIsoDateOnly(booking.dateFrom);
                    const to = toIsoDateOnly(booking.dateTo);
                    const nights = Math.max(nightsBetween(from, to), 1);
                    const guests = booking.guests ?? 0;
                    const bookedBy =
                      booking.customer?.name || booking.customer?.username || 'Unknown';
                    const total =
                      booking.totalPrice ?? (nights > 0 ? venue.price * nights : venue.price);

                    return (
                      <li
                        key={`${venue.id}-${booking.id}`}
                        className="flex flex-col gap-4 p-5 md:flex-row sm:items-start sm:gap-5"
                        aria-label={`Booking for ${venue.name} from ${from} to ${to}`}
                      >
                        <div className="shrink-0">
                          <div className="h-24 w-32 overflow-hidden rounded-md bg-gray-100">
                            <img
                              src={url}
                              alt={alt}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-lg font-semibold font-text">{venue.name}</h4>

                          <div className="mt-1 grid grid-cols-1 gap-1 text-sm text-gray-700 sm:grid-cols-2 font-text">
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
                          <div className="inline-flex items-center rounded-lg bg-dark px-3 py-1 text-sm font-semibold text-white font-text">
                            {formatCurrencyNOK(Number(total))}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          );
        })}
    </section>
  );
}
