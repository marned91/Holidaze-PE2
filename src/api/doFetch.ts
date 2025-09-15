import { API_KEY } from './endpoints';
import { getAccessToken } from '../utils/authStorage';

type DoFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function doFetch<T>(
  url: string,
  options: DoFetchOptions = {}
): Promise<T | null> {
  try {
    const tokenFromAuth = getAccessToken();
    const tokenFromLegacyKey = localStorage.getItem('token');
    const accessToken = tokenFromAuth || tokenFromLegacyKey || '';

    const shouldAttachAuthHeader =
      options.auth !== false && accessToken.length > 0;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      ...(shouldAttachAuthHeader
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
      ...(options.headers as Record<string, string> | undefined),
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 204) return null;

    let parsedBody: any = null;
    try {
      parsedBody = await response.clone().json();
    } catch {
      parsedBody = null;
    }

    if (response.ok) {
      return (parsedBody?.data as T) ?? null;
    }

    const message =
      parsedBody?.errors?.[0]?.message ||
      parsedBody?.message ||
      `${response.status} ${response.statusText}`;

    const error = new Error(message) as Error & {
      status?: number;
      details?: any;
    };
    error.status = response.status;
    error.details = parsedBody;
    throw error;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
