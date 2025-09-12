import { API_VENUES } from './endpoints';
import { doFetch } from './doFetch';
import type { TVenue } from '../types/venues';

export async function getVenue(venueId: string): Promise<TVenue> {
  const url = `${API_VENUES}/${encodeURIComponent(
    venueId
  )}?_bookings=true&_owner=true`;

  try {
    const data = await doFetch<TVenue>(url, { method: 'GET', auth: false });
    if (!data) throw new Error('Venue not found');
    return data;
  } catch (unknownError: unknown) {
    const message = (unknownError as Error)?.message ?? 'Failed to load venue';
    throw new Error(message);
  }
}

export async function listVenues(limit = 50): Promise<TVenue[]> {
  const url = `${API_VENUES}?limit=${encodeURIComponent(limit)}&_bookings=true`;

  try {
    const data = await doFetch<TVenue[]>(url, { method: 'GET', auth: false });
    return data ?? [];
  } catch (unknownError: unknown) {
    const message =
      (unknownError as Error)?.message ??
      'Failed to load venues, please reload the page';
    throw new Error(message);
  }
}
