/**
 * Custom event name dispatched on `window` when authentication state changes.
 *
 * Fires after login/logout so consumers can update UI (e.g., menus, badges).
 *
 * @example
 * window.addEventListener(AUTH_CHANGED_EVENT, () => {
 *   // refresh auth-aware UI
 * });
 */
export const AUTH_CHANGED_EVENT = 'auth:changed';
