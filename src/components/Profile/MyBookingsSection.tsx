// components/Profile/MyBookings/MyBookingsSection.tsx
import type { TVenue } from '../../types/venueTypes';
import { type TBooking, type TBookingWithVenue } from '../../types/bookingType';
import { MyBookingCard } from './MyBookingCard';

type Item = {
  booking: TBooking;
  venue: TVenue;
  totalPriceOverride?: number;
};

type BaseProps = {
  isLoading: boolean;
  errorMessage: string | null;
  title?: string;
  onEditBooking?: (booking: TBooking, venue: TVenue) => void;
  onCancelBooking?: (booking: TBooking, venue: TVenue) => void;
};

type WithItems = BaseProps & {
  items: Item[];
  bookings?: never;
};

type WithBookings = BaseProps & {
  items?: never;
  bookings: TBookingWithVenue[];
};

export function MyBookingsSection(props: WithItems | WithBookings) {
  const {
    isLoading,
    errorMessage,
    title = 'My bookings',
    onEditBooking,
    onCancelBooking,
  } = props;

  const normalized: Item[] =
    'items' in props && props.items
      ? props.items
      : 'bookings' in props && props.bookings
      ? props.bookings
          .filter((b) => !!b.venue)
          .map((b) => ({
            booking: b,
            venue: b.venue,
            totalPriceOverride:
              typeof b.totalPrice === 'number' ? b.totalPrice : undefined,
          }))
      : [];

  const sorted = [...normalized].sort((a, b) =>
    a.booking.dateFrom.localeCompare(b.booking.dateFrom)
  );

  return (
    <section>
      <h2 className="mb-4 text-3xl font-medium font-medium-buttons">{title}</h2>
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div className="aspect-[16/10] w-full animate-pulse bg-gray-100" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-1/2 rounded bg-gray-100" />
                <div className="h-4 w-3/4 rounded bg-gray-100" />
                <div className="h-4 w-1/3 rounded bg-gray-100" />
                <div className="h-8 w-full rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      {!isLoading && !errorMessage && sorted.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-700">You have no bookings yet.</p>
          <p className="text-sm text-gray-500">
            New bookings will show up here.
          </p>
        </div>
      )}
      {!isLoading && !errorMessage && sorted.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map(({ booking, venue, totalPriceOverride }) => (
            <MyBookingCard
              key={booking.id}
              booking={booking}
              venue={venue}
              totalPriceOverride={totalPriceOverride}
              onEdit={onEditBooking}
              onCancel={onCancelBooking}
            />
          ))}
        </div>
      )}
    </section>
  );
}
