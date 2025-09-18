import type { TVenue } from '../../types/venueTypes';
import type { TDateRange } from '../../types/dateType';
import {
  normalizeDateRange,
  isVenueAvailableForRange,
} from '../../utils/dateRange';

export type SortOrder = 'newest' | 'oldest' | 'priceLow' | 'priceHigh';

export type VenueFilterOptions = {
  selectedCity: string | null;
  minGuests: number | null;
  dateRange: TDateRange;
};

function normalizeString(value?: string): string {
  return (value ?? '').trim().toLowerCase();
}

function getMaxGuests(venue: TVenue): number {
  return Number.isFinite(venue.maxGuests) ? (venue.maxGuests as number) : 0;
}

export function isInNorway(venue: TVenue): boolean {
  const country = normalizeString(venue.location?.country);
  return (
    country === 'norway' ||
    country === 'norge' ||
    country === 'no' ||
    country.includes('norway') ||
    country.includes('norge')
  );
}

export function getCityOptions(allVenues: TVenue[]): string[] {
  const uniqueCities = new Set(
    (allVenues ?? [])
      .filter(isInNorway)
      .map((venue) => (venue.location?.city ?? '').trim())
      .filter((city) => city.length > 0)
  );
  return Array.from(uniqueCities).sort((a, b) => a.localeCompare(b));
}

export function isVenueAvailable(
  venue: TVenue,
  wantedRange: { from: Date; to: Date }
): boolean {
  return isVenueAvailableForRange(venue, wantedRange);
}

export function filterVenues(
  allVenues: TVenue[],
  { selectedCity, minGuests, dateRange }: VenueFilterOptions
): TVenue[] {
  let result = (allVenues ?? []).filter(isInNorway);

  if (selectedCity) {
    const wantedCity = normalizeString(selectedCity);
    result = result.filter(
      (venue) => normalizeString(venue.location?.city) === wantedCity
    );
  }

  if (minGuests != null) {
    result = result.filter((venue) => getMaxGuests(venue) >= minGuests);
  }

  const normalized = normalizeDateRange(dateRange);
  if (normalized) {
    result = result.filter((venue) =>
      isVenueAvailableForRange(venue, normalized)
    );
  }

  return result;
}

export function sortVenues(venues: TVenue[], sortOrder: SortOrder): TVenue[] {
  const sorted = [...venues];

  switch (sortOrder) {
    case 'newest':
      sorted.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
      break;

    case 'oldest':
      sorted.sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      );
      break;

    case 'priceLow':
      sorted.sort((a, b) => {
        const priceA =
          typeof a.price === 'number' ? a.price : Number.POSITIVE_INFINITY;
        const priceB =
          typeof b.price === 'number' ? b.price : Number.POSITIVE_INFINITY;
        return priceA - priceB;
      });
      break;

    case 'priceHigh':
    default:
      sorted.sort((a, b) => {
        const priceA =
          typeof a.price === 'number' ? a.price : Number.NEGATIVE_INFINITY;
        const priceB =
          typeof b.price === 'number' ? b.price : Number.NEGATIVE_INFINITY;
        return priceB - priceA;
      });
      break;
  }

  return sorted;
}
