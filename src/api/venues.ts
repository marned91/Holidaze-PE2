import { API_VENUES } from './endpoints';
import { doFetch } from './doFetch';
import type { TVenue } from '../types/venues';

export async function getVenue(
  venueId: string,
  options?: { owner?: boolean; bookings?: boolean }
): Promise<TVenue> {
  const params: string[] = [];
  if (options?.owner) params.push('_owner=true');
  if (options?.bookings) params.push('_bookings=true');

  const url =
    `${API_VENUES}/${encodeURIComponent(venueId)}` +
    (params.length ? `?${params.join('&')}` : '');

  const data = await doFetch<TVenue>(url, { method: 'GET', auth: false });
  if (!data) throw new Error('Venue not found');
  return data;
}
