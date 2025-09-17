import { API_BOOKINGS, API_PROFILES } from './endpoints';
import { doFetch } from './doFetch';
import {
  type TBookingWithVenue,
  type TCreateBookingPayload,
  type TCreateBookingResponse,
  type TUpdateBookingPayload,
  type TBooking,
} from '../types/bookingType';

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

export async function getBookingsByProfile(
  username: string,
  opts?: { withVenue?: boolean }
): Promise<TBookingWithVenue[]> {
  const params = new URLSearchParams();
  if (opts?.withVenue) params.set('_venue', 'true');

  const query = params.toString();
  const url = `${API_PROFILES}/${encodeURIComponent(username)}/bookings${
    query ? `?${query}` : ''
  }`;

  const data = await doFetch<TBookingWithVenue[]>(url, { auth: true });
  return data ?? [];
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await doFetch<void>(`${API_BOOKINGS}/${encodeURIComponent(bookingId)}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function updateBooking(
  bookingId: string,
  payload: TUpdateBookingPayload
): Promise<TBooking> {
  const data = await doFetch<TBooking>(
    `${API_BOOKINGS}/${encodeURIComponent(bookingId)}`,
    {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(payload),
    }
  );
  if (!data) throw new Error('Failed to update booking');
  return data;
}
