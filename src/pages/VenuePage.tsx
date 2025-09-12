import { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doFetch } from '../api/doFetch';
import { API_VENUES, API_BOOKINGS } from '../api/endpoints';
import { ImageCarousel } from '../components/VenueView/ImageCarousel';
import { VenueInformation } from '../components/VenueView/VenueInformation';
import { VenueDates } from '../components/VenueView/VenueDates';
import type { TDateRange } from '../types/date';
import { BookingSidebar } from '../components/VenueView/BookingSidebar';
import type { TVenue } from '../types/venues';
import { LoginRequiredModal } from '../components/Auth/LoginRequiredModal';
import { BookingReviewModal } from '../components/Booking/BookingReviewModal';
import { BookingConfirmedModal } from '../components/Booking/BookingConfirmedModal';
import { normalizeDateRange } from '../utils/dateRange';

type BookingPayload = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

function formatCurrencyNOK(n: number) {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    maximumFractionDigits: 0,
  }).format(n);
}
function dateRangeLabel(from: Date, to: Date) {
  const fmt: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return `${from.toLocaleDateString('en-GB', fmt)} – ${to.toLocaleDateString(
    'en-GB',
    fmt
  )}`;
}
function nightsBetween(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

type ModalView = 'none' | 'login' | 'review' | 'confirmed';

export function VenuePage() {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<TVenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<TDateRange>({});

  const [modalView, setModalView] = useState<ModalView>('none');
  const [submitting, setSubmitting] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    async function loadVenue() {
      if (!venueId) return;
      setLoading(true);
      setLoadError(null);
      try {
        const data = await doFetch<TVenue>(
          `${API_VENUES}/${encodeURIComponent(
            venueId
          )}?_bookings=true&_owner=true`,
          { method: 'GET', auth: false }
        );
        if (isActive) setVenue(data ?? null);
      } catch (error: any) {
        if (isActive) setLoadError(error?.message ?? 'Failed to load venue');
      } finally {
        if (isActive) setLoading(false);
      }
    }
    loadVenue();
    return () => {
      isActive = false;
    };
  }, [venueId]);

  const carouselImages = useMemo(
    () => (venue?.media ?? []).filter((m) => !!m?.url),
    [venue]
  );

  if (loading) return <div className="mx-auto max-w-7xl p-6">Loading…</div>;
  if (loadError)
    return (
      <div className="mx-auto max-w-7xl p-6 text-red-600">{loadError}</div>
    );
  if (!venue)
    return <div className="mx-auto max-w-7xl p-6">Venue not found.</div>;

  const normalized = normalizeDateRange(selectedDates);
  const nights = normalized ? nightsBetween(normalized.from, normalized.to) : 0;
  const nightly = typeof venue.price === 'number' ? venue.price : 0;
  const total = nights * nightly;

  const firstImageUrl = venue.media?.find((m) => !!m?.url)?.url || undefined;
  const dateText = normalized
    ? `${dateRangeLabel(normalized.from, normalized.to)} (${nights} ${
        nights === 1 ? 'night' : 'nights'
      })`
    : '';
  const totalText = formatCurrencyNOK(total);

  const locationText =
    [venue.location?.city, venue.location?.country]
      .filter(Boolean)
      .join(', ') || 'Location';

  function getAuthToken(): string | null {
    return (
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      null
    );
  }

  async function confirmBooking(payload: BookingPayload) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await doFetch<{ id: string }>(API_BOOKINGS, {
        method: 'POST',
        auth: true,
        body: JSON.stringify(payload),
      });
      setCreatedBookingId(created?.id ?? null);
      setModalView('confirmed');
    } catch (error: any) {
      setSubmitError(error?.message ?? 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6 h-screen overflow-y-scroll">
      <ImageCarousel images={carouselImages} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-12 xl:gap-16 items-start">
        <div className="space-y-8 lg:max-w-[760px] xl:max-w-[820px] 2xl:max-w-[880px]">
          <VenueInformation
            title={venue.name}
            locationText={locationText}
            rating={venue.rating}
            maxGuests={venue.maxGuests}
            description={venue.description ?? undefined}
            facilities={venue.meta}
          />

          <section>
            <VenueDates
              value={selectedDates}
              onChange={setSelectedDates}
              bookings={venue.bookings ?? []}
            />
          </section>
        </div>

        <div className="sticky top-15 z-55 shadow-xl">
          <BookingSidebar
            venue={venue}
            value={selectedDates}
            onChange={setSelectedDates}
            onRequest={(range, guests = 1) => {
              if (!getAuthToken()) {
                setModalView('login');
                return;
              }
              setSelectedDates({
                startDate: range.from.toISOString().slice(0, 10),
                endDate: range.to.toISOString().slice(0, 10),
              });
              (window as any).__bookingGuests = guests;
              setSubmitError(null);
              setModalView('review');
            }}
          />
        </div>
      </div>

      <LoginRequiredModal
        open={modalView === 'login'}
        onClose={() => setModalView('none')}
        onGotoLogin={() => navigate('/login')}
        onGotoRegister={() => navigate('/signup')}
      />

      <BookingReviewModal
        open={modalView === 'review'}
        onClose={() => setModalView('none')}
        onConfirm={() => {
          const range = normalizeDateRange(selectedDates);
          const guests = (window as any).__bookingGuests ?? 1;
          if (!range) return;
          confirmBooking({
            dateFrom: range.from.toISOString(),
            dateTo: range.to.toISOString(),
            guests,
            venueId: venue.id,
          });
        }}
        venueTitle={venue.name}
        locationText={locationText}
        imageUrl={firstImageUrl}
        dateRangeText={dateText}
        guestsText={`${(window as any).__bookingGuests ?? 1} ${
          ((window as any).__bookingGuests ?? 1) === 1 ? 'Guest' : 'Guests'
        }`}
        totalText={totalText}
        submitting={submitting}
        error={submitError}
      />

      <BookingConfirmedModal
        open={modalView === 'confirmed'}
        onClose={() => setModalView('none')}
        onViewBooking={() => {
          if (createdBookingId) navigate(`/bookings/${createdBookingId}`);
          else setModalView('none');
        }}
        venueTitle={venue.name}
        locationText={locationText}
        imageUrl={firstImageUrl}
        dateRangeText={dateText}
        guestsText={`${(window as any).__bookingGuests ?? 1} ${
          ((window as any).__bookingGuests ?? 1) === 1 ? 'Guest' : 'Guests'
        }`}
        totalText={totalText}
      />
    </div>
  );
}
