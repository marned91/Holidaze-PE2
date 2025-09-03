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

    if (response.status === 204) {
      return null;
    }

    const json = await response.json();

    if (response.ok) {
      return json.data as T;
    } else {
      const errorMessage = json.errors
        ? json.errors[0].message
        : 'Unknown error';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
