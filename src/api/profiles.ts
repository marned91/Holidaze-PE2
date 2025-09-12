// src/api/profiles.ts
import { API_PROFILES } from './endpoints';
import { doFetch } from './doFetch';
import type { TProfile } from '../types/profiles';

export async function getProfile(username: string): Promise<TProfile> {
  const url = `${API_PROFILES}/${encodeURIComponent(username)}`;
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
