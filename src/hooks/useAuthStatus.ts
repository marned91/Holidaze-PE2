import { useEffect, useState } from 'react';

export const AUTH_TOKEN_KEYS = ['accessToken', 'token', 'authToken'];
export const AUTH_CHANGED_EVENT = 'auth:changed';

function hasToken(): boolean {
  try {
    return AUTH_TOKEN_KEYS.some((key) => {
      const value = localStorage.getItem(key as string);
      return typeof value === 'string' && value.length > 0;
    });
  } catch {
    return false;
  }
}

export function authChanged(): void {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
