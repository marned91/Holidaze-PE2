import { API_AUTH_LOGIN, API_AUTH_REGISTER } from './endpoints.ts';
import { doFetch } from './doFetch.ts';
import {
  type TLoginResponse,
  type TRegisterResponse,
  type TRegisterData,
  type TRegisterFieldErrors,
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

  try {
    return await doFetch<TRegisterResponse>(API_AUTH_REGISTER, {
      method: 'POST',
      body,
      auth: false,
    });
  } catch (error: any) {
    const customError = new Error(
      error?.message || 'Registration failed'
    ) as Error & { fieldErrors?: TRegisterFieldErrors };

    const rawErrors = error?.details?.errors;

    if (rawErrors) {
      const fieldErrors: TRegisterFieldErrors = {};

      if (Array.isArray(rawErrors)) {
        for (const item of rawErrors) {
          const field = String(item?.field ?? item?.path ?? '');
          const message = String(item?.message ?? customError.message);
          if (field === 'name' || field === 'username')
            fieldErrors.name = message;
          else if (field === 'email') fieldErrors.email = message;
          else if (field === 'password') fieldErrors.password = message;
          else if (field === 'avatar.url' || field === 'avatarUrl')
            fieldErrors.avatarUrl = message;
        }
      } else if (typeof rawErrors === 'object') {
        fieldErrors.name = (rawErrors.name as string) ?? fieldErrors.name;
        fieldErrors.email = (rawErrors.email as string) ?? fieldErrors.email;
        fieldErrors.password =
          (rawErrors.password as string) ?? fieldErrors.password;
        fieldErrors.avatarUrl =
          (rawErrors['avatar.url'] as string) ??
          (rawErrors.avatarUrl as string) ??
          fieldErrors.avatarUrl;
      }

      // 🔹 Fallback: hvis API kun ga en message, putt den på riktig felt
      if (
        !fieldErrors.name &&
        !fieldErrors.email &&
        !fieldErrors.password &&
        !fieldErrors.avatarUrl
      ) {
        const msg = (customError.message || '').toLowerCase();
        if (msg.includes('name') || msg.includes('username'))
          fieldErrors.name = customError.message;
        else if (msg.includes('email')) fieldErrors.email = customError.message;
        else if (msg.includes('password'))
          fieldErrors.password = customError.message;
        else if (msg.includes('avatar'))
          fieldErrors.avatarUrl = customError.message;
      }

      customError.fieldErrors = fieldErrors;
    }

    throw customError;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
