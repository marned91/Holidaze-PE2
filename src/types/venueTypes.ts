/**
 * Types for the Venues domain.
 * Mirrors the public API; no client-derived fields added here.
 */

/** A single booking window for a venue (dates are strings as provided by the API). */
export type TVenueBooking = {
  /** Start date (format per API, typically YYYY-MM-DD). */
  dateFrom: string;
  /** End date (format per API, typically YYYY-MM-DD). */
  dateTo: string;
};

/**
 * A rentable venue as returned by the API.
 * @remarks
 * - `price` is NOK per night (per API).
 * - `created` / `updated` are date-time strings from the API (ISO-like).
 * - `bookings` (when present) only include date ranges.
 */
export type TVenue = {
  id: string;
  name: string;
  description?: string;
  /** Media gallery; `alt` is recommended for accessibility. */
  media?: {
    url: string;
    alt?: string;
  }[];
  /** Price per night in NOK. */
  price: number;
  /** Maximum number of guests the venue can host. */
  maxGuests: number;
  /** Optional rating (0–5 as provided by the API). */
  rating?: number;
  /** API date-time string (ISO-like). */
  created: string;
  /** API date-time string (ISO-like). */
  updated: string;
  /** Feature flags for the venue. */
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  /** Geographic and postal information (optional/partial). */
  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
    /** Latitude in decimal degrees. */
    lat?: number;
    /** Longitude in decimal degrees. */
    lng?: number;
  };
  /** Existing bookings with date ranges (strings as provided by the API). */
  bookings?: TVenueBooking[];
};

/**
 * Payload when creating a venue (client → API).
 * @remarks
 * - `price` is NOK per night (per API).
 * - `location` must include `country`; others are optional.
 */
export type TCreateVenueInput = {
  name: string;
  description: string;
  media: { url: string; alt?: string }[];
  maxGuests: number;
  price: number;
  location: { city?: string; country: string };
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
};

/**
 * A richer booking shape sometimes used by the client/UI.
 * @remarks
 * - `id`, `guests`, `customer`, and `totalPrice` may come from expanded endpoints
 *   or be computed client-side. Keep them optional unless guaranteed by the API.
 */
export type TVenueBookingExtended = TVenueBooking & {
  id: string;
  guests?: number;
  /** Minimal customer identification (if expanded). */
  customer?: { name?: string; username?: string };
  /** Total price for the booking window in NOK (client-computed when present). */
  totalPrice?: number;
};
