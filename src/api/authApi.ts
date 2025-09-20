import { API_AUTH_LOGIN, API_AUTH_REGISTER } from './endpoints.ts';
import { doFetch } from './doFetch.ts';
import {
  type TLoginResponse,
  type TRegisterResponse,
  type TRegisterData,
} from '../types/authTypes.ts';
import { AUTH_CHANGED_EVENT } from '../hooks/useAuthStatus';
import { setAuthSession, clearAuthSession } from '../utils/authStorage';

/**
 * Logs a user in against the API.
 *
 * Behavior:
 * - Sends POST to the login endpoint via doFetch.
 * - On success, stores the session and emits `AUTH_CHANGED_EVENT`.
 *
 * @param email - Account email.
 * @param password - Account password.
 * @returns Parsed response from the API (or null if no data envelope).
 * @throws Error when the request fails.
 */
export async function login(email: string, password: string) {
  const body = JSON.stringify({ email, password });
  const data = await doFetch<TLoginResponse>(API_AUTH_LOGIN, {
    method: 'POST',
    body,
    auth: false,
  });
  if (data) {
    setAuthSession(data.accessToken, data.name);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
  return data;
}

/**
 * Registers a new account with the API.
 *
 * Behavior:
 * - Sends POST to the register endpoint via doFetch.
 * - Lets server errors bubble up; callers map field-level errors if needed.
 *
 * @param userData - Registration payload.
 * @returns Parsed response from the API.
 * @throws Error when the request fails.
 */
export async function registerAccount(userData: TRegisterData) {
  return doFetch<TRegisterResponse>(API_AUTH_REGISTER, {
    method: 'POST',
    body: JSON.stringify(userData),
    auth: false,
  });
}

/**
 * Clears the stored auth session and emits `AUTH_CHANGED_EVENT`.
 */
export function logout() {
  clearAuthSession();
  if (
    typeof window !== 'undefined' &&
    typeof window.dispatchEvent === 'function'
  ) {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}
