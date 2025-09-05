import { type TVenue } from '../../types/venues';
import { type DateRange } from './VenuesFilters';

export type SortOrder = 'newest' | 'oldest' | 'priceLow' | 'priceHigh';

export type VenueFilterOptions = {
  selectedCity: string | null;
  minGuests: number | null;
  dateRange: DateRange;
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

function parseLocalDate(dateString: string): Date | null {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  return isNaN(date.getTime()) ? null : date;
}

function normalizeDateRange(
  dateRange: DateRange
): { from: Date; to: Date } | null {
  const from = dateRange.startDate ? parseLocalDate(dateRange.startDate) : null;
  const to = dateRange.endDate ? parseLocalDate(dateRange.endDate) : null;
  if (!from || !to) return null;
  if (from.getTime() > to.getTime()) return null;
  return { from, to };
}

function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return (
    aStart.getTime() <= bEnd.getTime() && bStart.getTime() <= aEnd.getTime()
  );
}

export function isVenueAvailable(
  venue: TVenue,
  wanted: { from: Date; to: Date }
): boolean {
  const bookings = venue.bookings ?? [];
  if (bookings.length === 0) return true;

  return bookings.every((booking) => {
    const bookingStart = new Date(booking.dateFrom);
    const bookingEnd = new Date(booking.dateTo);
    if (isNaN(bookingStart.getTime()) || isNaN(bookingEnd.getTime()))
      return true;
    return !rangesOverlap(wanted.from, wanted.to, bookingStart, bookingEnd);
  });
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
    result = result.filter((venue) => isVenueAvailable(venue, normalized));
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
