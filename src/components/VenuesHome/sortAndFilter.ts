import type { TVenue } from '../../types/venueTypes';
import type { TDateRange } from '../../types/dateTypes';
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

/**
 * Normalizes a string for comparisons.
 *
 * @param value - Input string.
 * @returns Lowercased, trimmed string (empty string when falsy).
 */
function normalizeString(value?: string): string {
  return (value ?? '').trim().toLowerCase();
}

/**
 * Safely reads the maximum guest capacity of a venue.
 *
 * @param venue - Venue object.
 * @returns A finite guest count or 0 when missing/invalid.
 */
function getMaxGuests(venue: TVenue): number {
  return Number.isFinite(venue.maxGuests) ? (venue.maxGuests as number) : 0;
}

/**
 * Checks whether a venue is located in Norway (lenient match).
 *
 * Behavior:
 * - Normalizes country string and matches common variants: "Norway", "Norge", "NO".
 * - Accepts partial matches that include these tokens.
 *
 * @param venue - Venue to test.
 * @returns True if the venue is considered Norwegian.
 */
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

/**
 * Builds a sorted list of unique Norwegian city names from all venues.
 *
 * Behavior:
 * - Filters to Norwegian venues via `isInNorway`.
 * - Extracts non-empty `location.city` values.
 * - Sorts ascending using locale-aware compare.
 *
 * @param allVenues - All venues (may include non-Norwegian).
 * @returns Alphabetically sorted, de-duplicated city list.
 */
export function getCityOptions(allVenues: TVenue[]): string[] {
  const uniqueCities = new Set(
    (allVenues ?? [])
      .filter(isInNorway)
      .map((venue) => (venue.location?.city ?? '').trim())
      .filter((city) => city.length > 0)
  );
  return Array.from(uniqueCities).sort((a, b) => a.localeCompare(b));
}

/**
 * Checks if a venue is available for an inclusive date range.
 *
 * @param venue - Venue to check.
 * @param wantedRange - Inclusive range with Date `from` and `to`.
 * @returns True if the venue is available for the range.
 */
export function isVenueAvailable(
  venue: TVenue,
  wantedRange: { from: Date; to: Date }
): boolean {
  return isVenueAvailableForRange(venue, wantedRange);
}

/**
 * Filters venues by country (Norway), city, min guests, and optional date range.
 *
 * Behavior:
 * - Always keeps only Norwegian venues (`isInNorway`).
 * - If `selectedCity` is provided, matches normalized city names.
 * - If `minGuests` is provided, keeps venues with `maxGuests ≥ minGuests`.
 * - If `dateRange` is valid after `normalizeDateRange`, keeps only available venues.
 *
 * @param allVenues - Input venue list.
 * @param options - City, min guests, and date range filters.
 * @returns Filtered venue list.
 */
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

/**
 * Sorts venues by the requested order.
 *
 * Behavior:
 * - 'newest' | 'oldest' use the `created` timestamp (ms precision).
 * - 'priceLow' sorts ascending by price; missing prices are treated as +∞.
 * - 'priceHigh' sorts descending by price; missing prices are treated as −∞.
 *
 * @param venues - Venues to sort (not mutated).
 * @param sortOrder - Desired sort order.
 * @returns New array with venues sorted accordingly.
 */
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
