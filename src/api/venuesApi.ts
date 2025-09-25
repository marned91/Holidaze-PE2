import { API_VENUES, API_PROFILES } from './endpoints';
import { doFetch } from './doFetch';
import type { TVenue, TCreateVenueInput } from '../types/venueTypes';

/**
 * Fetch a single venue by id, including bookings and owner.
 *
 * Behavior:
 * - Calls `doFetch` (GET) and includes `_bookings` and `_owner`.
 * - Returns the venue or throws a user-friendly Error message.
 *
 * @param venueId - Venue id (UUID or slug).
 * @returns The venue object.
 * @throws Error when the venue is missing or the request fails.
 */
export async function getVenue(venueId: string): Promise<TVenue> {
  const url = `${API_VENUES}/${encodeURIComponent(venueId)}?_bookings=true&_owner=true`;
  try {
    const responseData = await doFetch<TVenue>(url, {
      method: 'GET',
      auth: false,
    });
    if (!responseData) throw new Error('Venue not found');
    return responseData;
  } catch (error: unknown) {
    const errorObject =
      error && typeof error === 'object' ? (error as Record<string, unknown>) : {};
    const message =
      typeof errorObject.message === 'string' ? errorObject.message : 'Failed to load venue';
    throw new Error(message);
  }
}

/**
 * Fetch a list of venues (default limit 100), including bookings.
 *
 * Behavior:
 * - Calls `doFetch` (GET) with `limit` and `_bookings=true`.
 * - Returns an empty array if the server responds with null.
 *
 * @param limit - Maximum number of venues to fetch (default 100).
 * @returns Array of venues.
 * @throws Error when the request fails.
 */
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
      error && typeof error === 'object' ? (error as Record<string, unknown>) : {};
    const message =
      typeof errorObject.message === 'string'
        ? errorObject.message
        : 'Failed to load venues, please reload the page';
    throw new Error(message);
  }
}

/**
 * Fetch venues owned by a given profile.
 *
 * Behavior:
 * - Calls `doFetch` (GET) on `/profiles/:name/venues`.
 * - Supports pagination and optional `_bookings`.
 *
 * @param profileName - Owner profile name.
 * @param options - Optional query options.
 * @param options.withBookings - Include `_bookings=true`.
 * @param options.limit - Page size.
 * @param options.page - Page number (1-based).
 * @returns Array of venues for the owner.
 * @throws Error when the request fails.
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
  const url = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;

  try {
    const responseData = await doFetch<TVenue[]>(url, {
      method: 'GET',
      auth: true,
    });
    return responseData ?? [];
  } catch (error: unknown) {
    const errorObject =
      error && typeof error === 'object' ? (error as Record<string, unknown>) : {};
    const message =
      typeof errorObject.message === 'string'
        ? errorObject.message
        : 'Failed to load venues for owner';
    throw new Error(message);
  }
}

/**
 * Create a new venue.
 *
 * Behavior:
 * - Calls `doFetch` (POST) with JSON body.
 * - Returns the created venue or throws when missing.
 *
 * @param input - New venue payload.
 * @returns The created venue.
 * @throws Error when the request fails or the server returns no venue.
 */
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
      error && typeof error === 'object' ? (error as Record<string, unknown>) : {};
    const message =
      typeof errorObject.message === 'string' ? errorObject.message : 'Could not create venue';
    throw new Error(message);
  }
}

/**
 * Fetch one page of venues with options for size, bookings, and sorting.
 *
 * Behavior:
 * - Calls `doFetch` (GET) with page/limit and optional `_bookings`.
 * - Returns items only (no pagination envelope).
 *
 * @param options - Optional paging and sorting options.
 * @param options.page - Page number (default 1).
 * @param options.limit - Page size (default 100).
 * @param options.withBookings - Include `_bookings=true` (default true).
 * @param options.sort - Sort field.
 * @param options.sortOrder - Sort order.
 * @returns Array of venues for the requested page.
 * @throws Error when the request fails.
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
      error && typeof error === 'object' ? (error as Record<string, unknown>) : {};
    const message =
      typeof errorObject.message === 'string'
        ? errorObject.message
        : 'Failed to load venues (paged), please reload the page';
    throw new Error(message);
  }
}

/**
 * Fetch multiple pages of venues and return a flattened array.
 *
 * Behavior:
 * - Iteratively calls `listVenuesPaged` until empty/short page or `maxPages`.
 * - Returns a concatenated list of all fetched venues.
 *
 * @param options - Optional aggregation options.
 * @param options.limitPerPage - Page size per request (default 100).
 * @param options.maxPages - Maximum number of pages to fetch (default 10).
 * @param options.withBookings - Include `_bookings=true` (default true).
 * @param options.sort - Sort field (default 'created').
 * @param options.sortOrder - Sort order (default 'desc').
 * @returns All collected venues up to limits.
 * @throws Error when an underlying request fails.
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

/**
 * Update an existing venue.
 *
 * Behavior:
 * - Calls `doFetch` (PUT) with JSON body.
 * - Returns the updated venue or throws when missing.
 *
 * @param venueId - Id of the venue to update.
 * @param input - Updated venue payload.
 * @returns The updated venue.
 * @throws Error when the request fails or the server returns no venue.
 */
export async function updateVenue(venueId: string, input: TCreateVenueInput): Promise<TVenue> {
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
      error && typeof error === 'object' ? (error as Record<string, unknown>) : {};
    const message =
      typeof errorObject.message === 'string' ? errorObject.message : 'Could not update venue';
    throw new Error(message);
  }
}

/**
 * Delete a venue by id.
 *
 * Behavior:
 * - Calls `doFetch` (DELETE) with auth.
 * - Throws an Error with user-friendly message on failure.
 *
 * @param venueId - Id of the venue to delete.
 * @returns Resolves when deletion completes.
 * @throws Error when the request fails.
 */
export async function deleteVenue(venueId: string): Promise<void> {
  const url = `${API_VENUES}/${encodeURIComponent(venueId)}`;
  try {
    await doFetch<void>(url, { method: 'DELETE', auth: true });
  } catch (error: unknown) {
    const errorObject =
      error && typeof error === 'object' ? (error as Record<string, unknown>) : {};
    const message =
      typeof errorObject.message === 'string' ? errorObject.message : 'Could not delete venue';
    throw new Error(message);
  }
}

/**
 * Search venues by query and filter client-side by name (case-insensitive).
 *
 * Behavior:
 * - Returns `[]` for blank queries.
 * - Calls `/venues/search?q=...`, then filters by `name` locally.
 *
 * @param query - Search text.
 * @returns Matched venues by name.
 * @throws Error when the request fails.
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
  return venues.filter((venue) => (venue.name ?? '').toLowerCase().includes(lowercasedQuery));
}
