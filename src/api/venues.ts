import { API_VENUES, API_PROFILES } from './endpoints';
import { doFetch } from './doFetch';
import type { TVenue } from '../types/venues';
import type { CreateVenueInput } from '../types/venues';

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

export async function listVenues(limit = 100): Promise<TVenue[]> {
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

export async function getVenuesByOwner(
  profileName: string,
  options?: { withBookings?: boolean; limit?: number; page?: number }
): Promise<TVenue[]> {
  const params = new URLSearchParams();
  if (options?.withBookings) params.set('_bookings', 'true');
  if (options?.limit) params.set('limit', String(options.limit));
  if (options?.page) params.set('page', String(options.page));

  const base = `${API_PROFILES}/${encodeURIComponent(profileName)}/venues`;
  const url = params.toString() ? `${base}?${params.toString()}` : base;

  try {
    const data = await doFetch<TVenue[]>(url, { method: 'GET', auth: true });
    return data ?? [];
  } catch (unknownError: unknown) {
    const message =
      (unknownError as Error)?.message ?? 'Failed to load venues for owner';
    throw new Error(message);
  }
}

export async function createVenue(input: CreateVenueInput): Promise<TVenue> {
  const body = JSON.stringify(input);

  try {
    const data = await doFetch<TVenue>(API_VENUES, {
      method: 'POST',
      auth: true,
      body,
    });

    if (!data) throw new Error('No venue returned after create');
    return data;
  } catch (unknownError: unknown) {
    const message =
      (unknownError as Error)?.message || 'Could not create venue';
    throw new Error(message);
  }
}

// Hent én side med server-sortering
export async function listVenuesPaged(options?: {
  page?: number;
  limit?: number;
  withBookings?: boolean;
  sort?: 'created' | 'updated' | 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}): Promise<TVenue[]> {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 100;
  const withBookings = options?.withBookings ?? true;

  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (withBookings) params.set('_bookings', 'true');
  if (options?.sort) params.set('sort', options.sort);
  if (options?.sortOrder) params.set('sortOrder', options.sortOrder);

  const url = `${API_VENUES}?${params.toString()}`;

  try {
    const data = await doFetch<TVenue[]>(url, { method: 'GET', auth: false });
    return data ?? [];
  } catch (unknownError: unknown) {
    const message =
      (unknownError as Error)?.message ??
      'Failed to load venues (paged), please reload the page';
    throw new Error(message);
  }
}

export async function listVenuesAll(options?: {
  limitPerPage?: number;
  maxPages?: number;
  withBookings?: boolean;
  sort?: 'created' | 'updated' | 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}): Promise<TVenue[]> {
  const limitPerPage = options?.limitPerPage ?? 100;
  const maxPages = options?.maxPages ?? 10;

  const all: TVenue[] = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const batch = await listVenuesPaged({
      page,
      limit: limitPerPage,
      withBookings: options?.withBookings ?? true,
      sort: options?.sort ?? 'created',
      sortOrder: options?.sortOrder ?? 'desc',
    });
    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < limitPerPage) break; // siste side
  }
  return all;
}
