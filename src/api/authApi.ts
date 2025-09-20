import { API_AUTH_LOGIN, API_AUTH_REGISTER } from './endpoints.ts';
import { doFetch } from './doFetch.ts';
import {
  type TLoginResponse,
  type TRegisterResponse,
  type TRegisterData,
} from '../types/authTypes.ts';
import { AUTH_CHANGED_EVENT } from '../hooks/useAuthStatus';
import { setAuthSession, clearAuthSession } from '../utils/authStorage';

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

export async function registerAccount(userData: TRegisterData) {
  return doFetch<TRegisterResponse>(API_AUTH_REGISTER, {
    method: 'POST',
    body: JSON.stringify(userData),
    auth: false,
  });
}

export function logout() {
  clearAuthSession();
  if (
    typeof window !== 'undefined' &&
    typeof window.dispatchEvent === 'function'
  ) {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}
