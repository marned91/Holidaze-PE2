import { API_PROFILES } from './endpoints';
import { doFetch } from './doFetch';
import type { TProfile } from '../types/profileType';

/**
 * Fetches a profile by username.
 *
 * Behavior:
 * - Appends `_venues=true` and/or `_bookings=true` based on `options`.
 * - Uses authenticated request (`auth: true`).
 * - Throws an Error if no data is returned (e.g., profile not found).
 *
 * @param username - The profile username to fetch.
 * @param options - Optional flags for including related resources.
 * @param options.venues - If true, include venues owned by the profile.
 * @param options.bookings - If true, include bookings for the profile.
 * @returns The fetched profile.
 * @throws Error when the request fails or the profile is not found.
 */
export async function getProfile(
  username: string,
  options?: { venues?: boolean; bookings?: boolean }
): Promise<TProfile> {
  const params: string[] = [];
  if (options?.venues) params.push('_venues=true');
  if (options?.bookings) params.push('_bookings=true');

  const url =
    `${API_PROFILES}/${encodeURIComponent(username)}` +
    (params.length ? `?${params.join('&')}` : '');

  try {
    const data = await doFetch<TProfile>(url, { method: 'GET', auth: true });
    if (!data) throw new Error('Profile not found');
    return data;
  } catch (error) {
    const message =
      (error as Error)?.message ||
      'Could not get profile, please reload the page';
    throw new Error(message);
  }
}

/**
 * Updates the avatar image for a profile.
 *
 * Behavior:
 * - Sends a `PUT` to the profile endpoint with `{ avatar: { url, alt } }`.
 * - Uses authenticated request (`auth: true`).
 * - Throws an Error if the API returns no updated profile.
 *
 * @param username - The profile username to update.
 * @param url - The image URL for the avatar.
 * @param alt - Optional alt text for accessibility.
 * @returns The updated profile.
 * @throws Error when the request fails or the API returns no profile.
 */
export async function setProfilePicture(
  username: string,
  url: string,
  alt?: string
): Promise<TProfile> {
  const endpoint = `${API_PROFILES}/${encodeURIComponent(username)}`;
  const body = JSON.stringify({ avatar: { url, alt } });

  try {
    const data = await doFetch<TProfile>(endpoint, {
      method: 'PUT',
      auth: true,
      body,
    });
    if (!data) throw new Error('No profile returned after update');
    return data;
  } catch (error) {
    const message =
      (error as Error)?.message ||
      'Could not update profile picture, please try again';
    throw new Error(message);
  }
}
