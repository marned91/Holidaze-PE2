import { API_VENUES, API_PROFILES } from './endpoints';
import { doFetch } from './doFetch';
import type { TVenue, TCreateVenueInput } from '../types/venueTypes';

/** Fetch a single venue by id, including bookings and owner. */
export async function getVenue(venueId: string): Promise<TVenue> {
  const url = `${API_VENUES}/${encodeURIComponent(
    venueId
  )}?_bookings=true&_owner=true`;
  try {
    const responseData = await doFetch<TVenue>(url, {
      method: 'GET',
      auth: false,
    });
    if (!responseData) throw new Error('Venue not found');
    return responseData;
  } catch (error: unknown) {
    const errorObject =
      error && typeof error === 'object'
        ? (error as Record<string, unknown>)
        : {};
    const message =
      typeof errorObject.message === 'string'
        ? errorObject.message
        : 'Failed to load venue';
    throw new Error(message);
  }
}

/** Fetch a list of venues (default limit 100), including bookings. */
export async function listVenues(limit = 100): Promise<TVenue[]> {
  const url = `${API_VENUES}?limit=${encodeURIComponent(limit)}&_bookings=true`;
  try {
    const responseData = await doFetch<TVenue[]>(url, {
      method: 'GET',
      auth: false,
    });
    return responseData ?? [];
  } catch (error: unknown) {
    const errorObject =
      error && typeof error === 'object'
        ? (error as Record<string, unknown>)
        : {};
    const message =
      typeof errorObject.message === 'string'
        ? errorObject.message
        : 'Failed to load venues, please reload the page';
    throw new Error(message);
  }
}

/**
 * Fetch venues by owner profile name.
 * Use options to include bookings and handle pagination.
 */
export async function getVenuesByOwner(
  profileName: string,
  options?: { withBookings?: boolean; limit?: number; page?: number }
): Promise<TVenue[]> {
  const queryParams = new URLSearchParams();
  if (options?.withBookings) queryParams.set('_bookings', 'true');
  if (options?.limit) queryParams.set('limit', String(options.limit));
  if (options?.page) queryParams.set('page', String(options.page));

  const baseUrl = `${API_PROFILES}/${encodeURIComponent(profileName)}/venues`;
  const url = queryParams.toString()
    ? `${baseUrl}?${queryParams.toString()}`
    : baseUrl;

  try {
    const responseData = await doFetch<TVenue[]>(url, {
      method: 'GET',
      auth: true,
    });
    return responseData ?? [];
  } catch (error: unknown) {
    const errorObject =
      error && typeof error === 'object'
        ? (error as Record<string, unknown>)
        : {};
    const message =
      typeof errorObject.message === 'string'
        ? errorObject.message
        : 'Failed to load venues for owner';
    throw new Error(message);
  }
}

/** Create a new venue and return it. */
export async function createVenue(input: TCreateVenueInput): Promise<TVenue> {
  const body = JSON.stringify(input);
  try {
    const responseData = await doFetch<TVenue>(API_VENUES, {
      method: 'POST',
      auth: true,
      body,
    });
    if (!responseData) throw new Error('No venue returned after create');
    return responseData;
  } catch (error: unknown) {
    const errorObject =
      error && typeof error === 'object'
        ? (error as Record<string, unknown>)
        : {};
    const message =
      typeof errorObject.message === 'string'
        ? errorObject.message
        : 'Could not create venue';
    throw new Error(message);
  }
}

/**
 * Fetch one page of venues with options for size, bookings and sorting.
 * Returns the page items only (no envelope).
 */
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

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('limit', String(limit));
  if (withBookings) queryParams.set('_bookings', 'true');
  if (options?.sort) queryParams.set('sort', options.sort);
  if (options?.sortOrder) queryParams.set('sortOrder', options.sortOrder);

  const url = `${API_VENUES}?${queryParams.toString()}`;

  try {
    const responseData = await doFetch<TVenue[]>(url, {
      method: 'GET',
      auth: false,
    });
    return responseData ?? [];
  } catch (error: unknown) {
    const errorObject =
      error && typeof error === 'object'
        ? (error as Record<string, unknown>)
        : {};
    const message =
      typeof errorObject.message === 'string'
        ? errorObject.message
        : 'Failed to load venues (paged), please reload the page';
    throw new Error(message);
  }
}

/**
 * Fetch multiple pages and return a flattened array.
 * Stops early when a page returns fewer items than the page size.
 */
export async function listVenuesAll(options?: {
  limitPerPage?: number;
  maxPages?: number;
  withBookings?: boolean;
  sort?: 'created' | 'updated' | 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}): Promise<TVenue[]> {
  const limitPerPage = options?.limitPerPage ?? 100;
  const maxPages = options?.maxPages ?? 10;
  const allVenues: TVenue[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const pageVenues = await listVenuesPaged({
      page,
      limit: limitPerPage,
      withBookings: options?.withBookings ?? true,
      sort: options?.sort ?? 'created',
      sortOrder: options?.sortOrder ?? 'desc',
    });
    if (!pageVenues.length) break;

    allVenues.push(...pageVenues);
    if (pageVenues.length < limitPerPage) break;
  }

  return allVenues;
}

/** Update an existing venue and return it. */
export async function updateVenue(
  venueId: string,
  input: TCreateVenueInput
): Promise<TVenue> {
  const url = `${API_VENUES}/${encodeURIComponent(venueId)}`;
  const body = JSON.stringify(input);
  try {
    const responseData = await doFetch<TVenue>(url, {
      method: 'PUT',
      auth: true,
      body,
    });
    if (!responseData) throw new Error('No venue returned after update');
    return responseData;
  } catch (error: unknown) {
    const errorObject =
      error && typeof error === 'object'
        ? (error as Record<string, unknown>)
        : {};
    const message =
      typeof errorObject.message === 'string'
        ? errorObject.message
        : 'Could not update venue';
    throw new Error(message);
  }
}

/** Delete a venue by id. */
export async function deleteVenue(venueId: string): Promise<void> {
  const url = `${API_VENUES}/${encodeURIComponent(venueId)}`;
  try {
    await doFetch<void>(url, { method: 'DELETE', auth: true });
  } catch (error: unknown) {
    const errorObject =
      error && typeof error === 'object'
        ? (error as Record<string, unknown>)
        : {};
    const message =
      typeof errorObject.message === 'string'
        ? errorObject.message
        : 'Could not delete venue';
    throw new Error(message);
  }
}

/**
 * Search venues on the server and filter client-side by name (case-insensitive).
 * Returns an empty array for blank queries.
 */
export async function searchVenuesByName(query: string): Promise<TVenue[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const url = `${API_VENUES}/search?q=${encodeURIComponent(trimmedQuery)}`;
  const responseData = await doFetch<TVenue[]>(url, {
    method: 'GET',
    auth: false,
    headers: { Accept: 'application/json' },
  });

  const venues = responseData ?? [];
  const lowercasedQuery = trimmedQuery.toLowerCase();
  return venues.filter((venue) =>
    (venue.name ?? '').toLowerCase().includes(lowercasedQuery)
  );
}
