export const TOKEN_KEY = 'token';
export const USERNAME_KEY = 'username';

const OLD_AUTH_STORAGE_KEY = 'auth';
const OLD_USER_STORAGE_KEY = 'user';

export function setAuthSession(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function clearAuthSession() {
  [TOKEN_KEY, USERNAME_KEY, OLD_AUTH_STORAGE_KEY, OLD_USER_STORAGE_KEY].forEach(
    (key) => localStorage.removeItem(key)
  );
}

export function migrateOldStorageOnce() {
  if (localStorage.getItem(TOKEN_KEY) || localStorage.getItem(USERNAME_KEY)) {
    localStorage.removeItem(OLD_AUTH_STORAGE_KEY);
    localStorage.removeItem(OLD_USER_STORAGE_KEY);
    return;
  }

  try {
    const oldAuthJsonString = localStorage.getItem(OLD_AUTH_STORAGE_KEY);
    if (oldAuthJsonString) {
      const oldAuthObject = JSON.parse(oldAuthJsonString) as Partial<{
        token: string;
        username: string;
      }>;
      if (typeof oldAuthObject.token === 'string') {
        localStorage.setItem(TOKEN_KEY, oldAuthObject.token);
      }
      if (typeof oldAuthObject.username === 'string') {
        localStorage.setItem(USERNAME_KEY, oldAuthObject.username);
      }
      localStorage.removeItem(OLD_AUTH_STORAGE_KEY);
    }
  } catch {
    localStorage.removeItem(OLD_AUTH_STORAGE_KEY);
  }

  try {
    const oldUserJsonString = localStorage.getItem(OLD_USER_STORAGE_KEY);
    if (oldUserJsonString) {
      const oldUserObject = JSON.parse(oldUserJsonString) as Partial<{
        accessToken: string;
        name: string;
      }>;
      if (typeof oldUserObject.accessToken === 'string') {
        localStorage.setItem(TOKEN_KEY, oldUserObject.accessToken);
      }
      if (typeof oldUserObject.name === 'string') {
        localStorage.setItem(USERNAME_KEY, oldUserObject.name);
      }
      localStorage.removeItem(OLD_USER_STORAGE_KEY);
    }
  } catch {
    localStorage.removeItem(OLD_USER_STORAGE_KEY);
  }
}
