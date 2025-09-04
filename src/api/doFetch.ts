import { API_KEY } from './endpoints';

type doFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function doFetch<T>(
  url: string,
  options: doFetchOptions = {}
): Promise<T | null> {
  try {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      ...(options.auth !== false && token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 204) return null;

    let json: any = null;
    try {
      json = await response.clone().json();
    } catch {}

    if (response.ok) {
      return (json?.data as T) ?? null;
    }

    const message =
      json?.errors?.[0]?.message ||
      json?.message ||
      `${response.status} ${response.statusText}`;

    const error = new Error(message) as Error & {
      status?: number;
      details?: any;
    };
    error.status = response.status;
    error.details = json;
    throw error;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
