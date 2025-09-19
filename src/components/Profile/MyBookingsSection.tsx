import { useMemo, useState } from 'react';
import type { TVenue } from '../../types/venueTypes';
import type { TBooking, TBookingWithVenue } from '../../types/bookingType';
import { MyBookingCard } from './MyBookingCard';
import { EditBookingModal } from './EditBookingModal';

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

function isUpcoming(booking: TBooking, todayIso: string) {
  return (booking.dateTo || '').slice(0, 10) >= todayIso;
}

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

  const [editedById, setEditedById] = useState<Record<string, TBooking>>({});
  const displayed: Item[] = useMemo(
    () =>
      normalized.map((it) => ({
        ...it,
        booking: editedById[it.booking.id] ?? it.booking,
      })),
    [normalized, editedById]
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<{
    booking: TBooking;
    venue: TVenue;
  } | null>(null);

  function openEdit(booking: TBooking, venue: TVenue) {
    setSelected({ booking, venue });
    setIsEditOpen(true);
    onEditBooking?.(booking, venue);
  }

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const todayIso = new Date().toISOString().slice(0, 10);

  const counts = useMemo(() => {
    let upcoming = 0;
    let past = 0;
    for (const item of displayed) {
      if (isUpcoming(item.booking, todayIso)) upcoming += 1;
      else past += 1;
    }
    return { all: displayed.length, upcoming, past };
  }, [displayed, todayIso]);

  const filtered = displayed.filter(({ booking }) => {
    if (filter === 'all') return true;
    const u = isUpcoming(booking, todayIso);
    return filter === 'upcoming' ? u : !u;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (filter === 'all') {
      const aU = isUpcoming(a.booking, todayIso);
      const bU = isUpcoming(b.booking, todayIso);
      if (aU !== bU) return aU ? -1 : 1;
    }
    return a.booking.dateFrom.localeCompare(b.booking.dateFrom);
  });

  return (
    <section>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-medium font-medium-buttons">{title}</h2>
        <div
          className="flex w-full sm:w-auto flex-wrap items-center gap-2 overflow-x-auto sm:overflow-visible -mx-1 px-1"
          aria-label="Filter bookings"
        >
          {(['all', 'upcoming', 'past'] as const).map((key) => {
            const isActive = filter === key;
            const label =
              key === 'all' ? 'All' : key === 'upcoming' ? 'Upcoming' : 'Past';
            const badge =
              key === 'all'
                ? counts.all
                : key === 'upcoming'
                ? counts.upcoming
                : counts.past;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(key)}
                className={`shrink-0 snap-start flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-colors font-medium-buttons ${
                  isActive
                    ? 'border-gray-900 bg-dark text-white'
                    : 'border-gray-300 text-gray-700 hover:bg-dark hover:text-white'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`min-w-[1.5rem] rounded-full px-2 py-0.5 text-center text-xs ${
                    isActive
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
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
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center font-text">
          <p className="text-gray-700">
            You do not have any past bookings yet.
          </p>
        </div>
      )}
      {!isLoading && !errorMessage && sorted.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 font-text">
          {sorted.map(({ booking, venue, totalPriceOverride }) => (
            <MyBookingCard
              key={booking.id}
              booking={booking}
              venue={venue}
              totalPriceOverride={totalPriceOverride}
              onEdit={openEdit}
              onCancel={onCancelBooking}
              hideActions={!isUpcoming(booking, todayIso)}
            />
          ))}
        </div>
      )}
      {selected && (
        <EditBookingModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          booking={selected.booking}
          venue={selected.venue}
          onUpdated={(updated) => {
            setEditedById((prev) => ({ ...prev, [updated.id]: updated }));
            setIsEditOpen(false);
          }}
        />
      )}
    </section>
  );
}
