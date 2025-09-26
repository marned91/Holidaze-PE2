import { API_KEY } from './endpoints';
import { getAccessToken } from '../utils/authStorage';
import type { TDoFetchOptions } from '../types/apiTypes';

/**
 * Thin wrapper around `fetch` that normalizes headers and response handling.
 *
 * Behavior:
 * - Adds `Content-Type: application/json` and `X-Noroff-API-Key` headers.
 * - Adds `Authorization: Bearer <token>` unless `options.auth === false` or no token is available.
 * - Parses the JSON response and returns the `data` property (if present); otherwise returns `null`.
 * - Returns `null` for HTTP 204 (No Content).
 * - On non-OK responses, throws an `Error` augmented with:
 *    - `status` (HTTP status code)
 *    - `details` (parsed response body when available)
 *
 * @template T The expected shape of `data` on success.
 * @param url Request URL.
 * @param options Request options; `auth` defaults to `true`.
 * @returns Promise resolving to `T | null`.
 * @throws Error with optional `status` and `details` when the response is not OK or parsing fails.
 */
export async function doFetch<T>(url: string, options: TDoFetchOptions = {}): Promise<T | null> {
  // eslint-disable-next-line no-useless-catch
  try {
    const tokenFromAuth = getAccessToken();
    const tokenFromLegacyKey = localStorage.getItem('token');
    const accessToken = tokenFromAuth || tokenFromLegacyKey || '';

    const shouldAttachAuthHeader = options.auth !== false && accessToken.length > 0;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      ...(shouldAttachAuthHeader ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 204) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details?: any;
    };
    error.status = response.status;
    error.details = parsedBody;
    throw error;
  } catch (error) {
    throw error;
  }
}
