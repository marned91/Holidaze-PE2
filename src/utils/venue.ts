import type { TVenue } from '../types/venueTypes';
import PlaceholderImage from '../assets/placeholder.png';

/** Build a human-readable "City, Country" location label; falls back to "Location". */
export function getLocationText(venue: Pick<TVenue, 'location'>): string {
  const city = venue.location?.city?.trim();
  const country = venue.location?.country?.trim();
  return [city, country].filter(Boolean).join(', ') || 'Location';
}

/** Options for `getVenueImage`. */
type GetVenueImageOptions = {
  /** Optional fallback image URL used when no valid media URL is found. */
  fallback?: string;
};

/**
 * Select the first non-empty media URL for a venue and return `{ url, alt }`.
 * Falls back to provided `options.fallback`, then to a bundled placeholder image.
 */
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

/**
 * Create a label for maximum guests (e.g., "4 guests" or "1 guest").
 * Returns "Guests" when `maxGuests` is not a finite number.
 */
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
