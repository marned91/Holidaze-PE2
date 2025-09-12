import { API_BOOKINGS } from './endpoints';
import { doFetch } from './doFetch';

export type CreateBookingPayload = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

export type CreateBookingResponse = { id: string };

export async function createBooking(
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> {
  const data = await doFetch<CreateBookingResponse>(API_BOOKINGS, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });

  if (!data) {
    throw new Error('Failed to create booking');
  }
  return data;
}
