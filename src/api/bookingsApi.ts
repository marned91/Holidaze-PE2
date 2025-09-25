import { API_BOOKINGS, API_PROFILES } from './endpoints';
import { doFetch } from './doFetch';
import {
  type TBookingWithVenue,
  type TCreateBookingPayload,
  type TCreateBookingResponse,
  type TUpdateBookingPayload,
  type TBooking,
} from '../types/bookingTypes';

/**
 * Creates a booking for the authenticated user.
 *
 * Behavior:
 * - Sends POST to `/bookings` via doFetch.
 * - Throws if the API returns no data.
 *
 * @param payload - Booking creation payload.
 * @returns The created booking response from the API.
 * @throws Error when the request fails or no data is returned.
 */
export async function createBooking(
  payload: TCreateBookingPayload
): Promise<TCreateBookingResponse> {
  const data = await doFetch<TCreateBookingResponse>(API_BOOKINGS, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });

  if (!data) {
    throw new Error('Failed to create booking');
  }
  return data;
}

/**
 * Lists bookings for a profile (by username).
 *
 * Behavior:
 * - Adds `_venue=true` when `options.withVenue` is set.
 * - Returns an empty array when the API returns no data.
 *
 * @param username - Profile username.
 * @param options - Optional flags for related data inclusion.
 * @returns An array of bookings (possibly empty).
 * @throws Error when the request fails.
 */
export async function getBookingsByProfile(
  username: string,
  options?: { withVenue?: boolean }
): Promise<TBookingWithVenue[]> {
  const params = new URLSearchParams();
  if (options?.withVenue) params.set('_venue', 'true');
  const query = params.toString();
  const url = `${API_PROFILES}/${encodeURIComponent(username)}/bookings${query ? `?${query}` : ''}`;
  const data = await doFetch<TBookingWithVenue[]>(url, { auth: true });
  return data ?? [];
}

/**
 * Cancels a booking by id for the authenticated user.
 *
 * @param bookingId - Booking identifier.
 * @returns Nothing.
 * @throws Error when the request fails.
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  await doFetch<void>(`${API_BOOKINGS}/${encodeURIComponent(bookingId)}`, {
    method: 'DELETE',
    auth: true,
  });
}

/**
 * Updates a booking by id.
 *
 * Behavior:
 * - Sends PUT to `/bookings/:id` via doFetch.
 * - Throws if the API returns no data.
 *
 * @param bookingId - Booking identifier.
 * @param payload - Booking update payload.
 * @returns The updated booking from the API.
 * @throws Error when the request fails or no data is returned.
 */
export async function updateBooking(
  bookingId: string,
  payload: TUpdateBookingPayload
): Promise<TBooking> {
  const data = await doFetch<TBooking>(`${API_BOOKINGS}/${encodeURIComponent(bookingId)}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  });
  if (!data) throw new Error('Failed to update booking');
  return data;
}
