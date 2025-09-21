import { type TVenue } from './venueTypes';

/** Types for Bookings domain. Mirrors the public API; client-derived fields are explicitly noted. */

/** Local calendar date in the form YYYY-MM-DD (no time component). */
export type YmdDate = string;

/** ISO 8601 timestamp (UTC), e.g., 2025-09-21T12:34:56.000Z. */
export type IsoDateTime = string;

/**
 * A booking as returned by the API.
 * @remarks
 * - `dateFrom` / `dateTo` are local dates (YYYY-MM-DD), no time component.
 * - `created` and `updated` are ISO 8601 timestamps (UTC).
 */
export type TBooking = {
  id: string;
  dateFrom: YmdDate;
  dateTo: YmdDate;
  guests: number;
  created: IsoDateTime;
  updated: IsoDateTime;
};

/**
 * A booking paired with its venue.
 * @remarks
 * - `totalPrice` is client-derived (not part of the API payload).
 */
export type TBookingWithVenue = TBooking & {
  venue: TVenue;
  totalPrice?: number;
};

/**
 * Payload when creating a booking (client → API).
 * @remarks
 * - Dates use local YYYY-MM-DD format.
 */
export type TCreateBookingPayload = {
  dateFrom: YmdDate;
  dateTo: YmdDate;
  guests: number;
  venueId: string;
};

/** Minimal API response after creating a booking. */
export type TCreateBookingResponse = { id: string };

/**
 * Payload for updating a booking (client → API).
 * @remarks
 * - Dates use local YYYY-MM-DD format.
 */
export type TUpdateBookingPayload = {
  dateFrom: YmdDate;
  dateTo: YmdDate;
  guests: number;
};
