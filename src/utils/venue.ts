import type { TVenue } from '../types/venueTypes';
import PlaceholderImage from '../assets/placeholder.png';

export function getLocationText(venue: Pick<TVenue, 'location'>): string {
  const city = venue.location?.city?.trim();
  const country = venue.location?.country?.trim();
  return [city, country].filter(Boolean).join(', ') || 'Location';
}

type GetVenueImageOptions = {
  fallback?: string;
};

export function getVenueImage(
  venue: Pick<TVenue, 'media' | 'name'>,
  options?: GetVenueImageOptions
): { url: string; alt: string } {
  const firstValidMedia = venue.media?.find(
    (mediaItem) => (mediaItem?.url ?? '').trim().length > 0
  );

  const url =
    firstValidMedia?.url?.trim() || options?.fallback || PlaceholderImage;
  const alt = (firstValidMedia?.alt || venue.name || 'Venue image').trim();

  return { url, alt };
}

export function getGuestsText(
  maxGuests?: number,
  singular = 'guest',
  plural = 'guests'
): string {
  if (typeof maxGuests !== 'number' || !Number.isFinite(maxGuests)) {
    return 'Guests';
  }
  return `${maxGuests} ${maxGuests === 1 ? singular : plural}`;
}
