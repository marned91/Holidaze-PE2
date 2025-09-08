//import { useNavigate } from 'react-router-dom';
//import { useAuthStatus } from '../hooks/useAuthStatus';
import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doFetch } from '../api/doFetch';
import { API_VENUES } from '../api/endpoints';
import { ImageCarousel } from '../components/VenueView/ImageCarousel';
import { type CarouselImage } from '../components/VenueView/ImageCarousel';
import type { TVenue } from '../types/venues';

export function VenuePage() {
  const { venueId } = useParams<{ venueId: string }>();

  const [venue, setVenue] = useState<TVenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  const carouselImages: CarouselImage[] = useMemo(() => {
    const mediaList: Array<{ url: string; alt?: string }> = (venue?.media ??
      []) as Array<{ url: string; alt?: string }>;

    return mediaList
      .filter((mediaItem) => Boolean(mediaItem.url))
      .map((mediaItem) => ({
        url: mediaItem.url,
        alt: mediaItem.alt || venue?.name || 'Venue image',
      }));
  }, [venue]);

  if (loading) return <div className="mx-auto max-w-6xl p-6">Loading…</div>;
  if (loadError)
    return (
      <div className="mx-auto max-w-6xl p-6 text-red-600">{loadError}</div>
    );
  if (!venue)
    return <div className="mx-auto max-w-6xl p-6">Venue not found.</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <ImageCarousel images={carouselImages} />
    </div>
  );
}
