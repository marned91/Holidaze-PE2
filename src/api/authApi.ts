import { API_AUTH_LOGIN, API_AUTH_REGISTER } from './endpoints.ts';
import { doFetch } from './doFetch.ts';
import {
  type TLoginResponse,
  type TRegisterResponse,
  type TRegisterData,
} from '../types/auth.ts';

export async function login(email: string, password: string) {
  const body = JSON.stringify({ email, password });

  const data = await doFetch<TLoginResponse>(API_AUTH_LOGIN, {
    method: 'POST',
    body,
    auth: false,
  });

  if (data) {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
}

export async function register(userData: TRegisterData) {
  const body = JSON.stringify(userData);

  const data = await doFetch<TRegisterResponse>(API_AUTH_REGISTER, {
    method: 'POST',
    body,
    auth: false,
  });

  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
