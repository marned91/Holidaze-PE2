import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doFetch } from '../api/doFetch';
import { API_VENUES } from '../api/endpoints';
import { ImageCarousel } from '../components/VenueView/ImageCarousel';
import { VenueInformation } from '../components/VenueView/VenueInformation';
import {
  VenueDates,
  type DateRangeValue,
} from '../components/VenueView/VenueDates';
import { BookingSidebar } from '../components/VenueView/BookingSidebar';
import type { TVenue } from '../types/venues';

export function VenuePage() {
  const { venueId } = useParams<{ venueId: string }>();

  const [venue, setVenue] = useState<TVenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateRangeValue>({});

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

  const locationText =
    [venue.location?.city, venue.location?.country]
      .filter(Boolean)
      .join(', ') || 'Location';

  return (
    <div className="mx-auto max-w-7xl p-6">
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
        <div className="self-start">
          {/* Optional separate heading like in your mock */}
          <h3 className="mb-3 text-xl font-semibold hidden lg:block">
            Availability
          </h3>
          <BookingSidebar
            venue={venue}
            value={selectedDates}
            onChange={setSelectedDates}
            onRequest={(range, guests) => {
              console.log('Request booking for', range, 'guests:', guests);
            }}
          />
        </div>
      </div>
    </div>
  );
}
