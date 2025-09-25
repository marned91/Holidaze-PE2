import { SkeletonVenueView } from '../components/Common/skeleton/SkeletonVenueView';
import { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVenue } from '../api/venuesApi';
import { createBooking } from '../api/bookingsApi';
import type { TCreateBookingPayload } from '../types/bookingTypes';
import { ImageCarousel } from '../components/VenueView/ImageCarousel';
import { VenueInformation } from '../components/VenueView/VenueInformation';
import { VenueDates } from '../components/VenueView/VenueDates';
import type { TDateRange } from '../types/dateTypes';
import { BookingSidebar } from '../components/VenueView/BookingSidebar';
import type { TVenue } from '../types/venueTypes';
import { LoginRequiredModal } from '../components/Auth/LoginRequiredModal';
import { BookingReviewModal } from '../components/Booking/BookingReviewModal';
import { BookingConfirmedModal } from '../components/Booking/BookingConfirmedModal';
import { normalizeDateRange } from '../utils/dateRange';
import { formatCurrencyNOK } from '../utils/currency';
import { getLocationText, getVenueImage } from '../utils/venue';
import { dateRangeLabel, nightsBetween, formatISOYmd } from '../utils/date';
import { getUsername } from '../utils/authStorage';

type ModalView = 'none' | 'login' | 'review' | 'confirmed';

// Local typing for the booking guests scratch value on window
interface WindowWithBooking extends Window {
  __bookingGuests?: number;
}

function hasAuthToken(): boolean {
  return Boolean(
    localStorage.getItem('accessToken') || localStorage.getItem('token')
  );
}

/**
 * Venue detail page showing images, information, availability, and booking flow.
 *
 * @remarks
 * - Presents a review modal before creating a booking.
 * - After confirmation, the “View booking” action navigates to the profile page/My Bookings.
 */
export function VenuePage() {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<TVenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<TDateRange>({});

  const [modalView, setModalView] = useState<ModalView>('none');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    async function loadVenue() {
      if (!venueId) return;
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getVenue(venueId);
        if (isActive) setVenue(data ?? null);
      } catch (error: unknown) {
        const message = (error as Error)?.message ?? 'Failed to load venue';
        if (isActive) setLoadError(message);
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
    () => (venue?.media ?? []).filter((mediaItem) => Boolean(mediaItem?.url)),
    [venue]
  );

  if (loading) return <SkeletonVenueView />;

  if (loadError)
    return (
      <div className="mx-auto max-w-2xl p-6 text-red-600">{loadError}</div>
    );
  if (!venue)
    return <div className="mx-auto max-w-7xl p-6">Venue not found.</div>;

  const normalized = normalizeDateRange(selectedDates);
  const nights = normalized ? nightsBetween(normalized.from, normalized.to) : 0;
  const nightly = typeof venue.price === 'number' ? venue.price : 0;
  const total = nights * nightly;
  const { url: firstImageUrl } = getVenueImage(venue);
  const dateText = normalized
    ? `${dateRangeLabel(normalized.from, normalized.to)} (${nights} ${
        nights === 1 ? 'night' : 'nights'
      })`
    : '';
  const totalText = formatCurrencyNOK(total);
  const locationText = getLocationText(venue);

  async function confirmBooking(payload: TCreateBookingPayload) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createBooking(payload);
      setModalView('confirmed');
    } catch (error: unknown) {
      const message = (error as Error)?.message ?? 'Failed to create booking';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 min-h-screen overflow-x-clip pb-24">
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
              if (!hasAuthToken()) {
                setModalView('login');
                return;
              }
              setSelectedDates({
                startDate: formatISOYmd(range.from),
                endDate: formatISOYmd(range.to),
              });
              (window as WindowWithBooking).__bookingGuests = guests;
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
          const guests = (window as WindowWithBooking).__bookingGuests ?? 1;
          if (!range) return;
          const payload: TCreateBookingPayload = {
            dateFrom: formatISOYmd(range.from),
            dateTo: formatISOYmd(range.to),
            guests,
            venueId: venue.id,
          };
          confirmBooking(payload);
        }}
        venueTitle={venue.name}
        locationText={locationText}
        imageUrl={firstImageUrl}
        dateRangeText={dateText}
        guestsText={`${(window as WindowWithBooking).__bookingGuests ?? 1} ${
          ((window as WindowWithBooking).__bookingGuests ?? 1) === 1
            ? 'Guest'
            : 'Guests'
        }`}
        totalText={totalText}
        submitting={submitting}
        error={submitError}
      />
      <BookingConfirmedModal
        open={modalView === 'confirmed'}
        onClose={() => setModalView('none')}
        onViewBooking={() => {
          const username = getUsername()!;
          navigate(`/profile/${encodeURIComponent(username)}/bookings`);
        }}
        venueTitle={venue.name}
        locationText={locationText}
        imageUrl={firstImageUrl}
        dateRangeText={dateText}
        guestsText={`${(window as WindowWithBooking).__bookingGuests ?? 1} ${
          ((window as WindowWithBooking).__bookingGuests ?? 1) === 1
            ? 'Guest'
            : 'Guests'
        }`}
        totalText={totalText}
      />
    </div>
  );
}
