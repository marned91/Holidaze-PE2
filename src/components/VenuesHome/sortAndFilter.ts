import type { TVenue } from '../../types/venues';
import type { TDateRange } from '../../types/date';
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

export function isInNorway(venue: TVenue): boolean {
  return /norway|norge/i.test(venue.location?.country ?? '');
}

export function getCityOptions(allVenues: TVenue[]): string[] {
  const uniqueCities = new Set(
    (allVenues ?? [])
      .filter(isInNorway)
      .map((venue) => (venue.location?.city || '').trim())
      .filter((city) => city.length > 0)
  );
  return Array.from(uniqueCities).sort((a, b) => a.localeCompare(b));
}

export function isVenueAvailable(
  venue: TVenue,
  wanted: { from: Date; to: Date }
): boolean {
  return isVenueAvailableForRange(venue, wanted);
}

export function filterVenues(
  allVenues: TVenue[],
  { selectedCity, minGuests, dateRange }: VenueFilterOptions
): TVenue[] {
  let result = allVenues.filter(isInNorway);

  if (selectedCity) {
    const selectedCityLower = selectedCity.toLowerCase();
    result = result.filter(
      (venue) =>
        (venue.location?.city || '').toLowerCase() === selectedCityLower
    );
  }

  if (minGuests != null) {
    result = result.filter(
      (venue) =>
        (typeof venue.maxGuests === 'number' ? venue.maxGuests : 0) >= minGuests
    );
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

  if (sortOrder === 'newest') {
    sorted.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );
  } else if (sortOrder === 'oldest') {
    sorted.sort(
      (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
    );
  } else if (sortOrder === 'priceLow') {
    sorted.sort((a, b) => {
      const priceA =
        typeof a.price === 'number' ? a.price : Number.POSITIVE_INFINITY;
      const priceB =
        typeof b.price === 'number' ? b.price : Number.POSITIVE_INFINITY;
      return priceA - priceB;
    });
  } else {
    sorted.sort((a, b) => {
      const priceA =
        typeof a.price === 'number' ? a.price : Number.NEGATIVE_INFINITY;
      const priceB =
        typeof b.price === 'number' ? b.price : Number.NEGATIVE_INFINITY;
      return priceB - priceA;
    });
  }

  return sorted;
}
