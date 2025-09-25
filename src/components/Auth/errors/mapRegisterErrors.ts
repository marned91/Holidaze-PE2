import type { TRegisterFieldErrors } from '../../../types/authTypes';

/**
 * Maps a server error object (from doFetch) to field-level errors
 * used by the sign-up form. Returns undefined if nothing could be mapped.
 */
export function mapRegisterErrors(error: unknown): TRegisterFieldErrors | undefined {
  const errorObject =
    error && typeof error === 'object' ? (error as Record<string, unknown>) : undefined;

  const details =
    errorObject?.details && typeof errorObject.details === 'object'
      ? (errorObject.details as Record<string, unknown>)
      : undefined;

  const raw = details?.errors;
  const fieldErrors: TRegisterFieldErrors = {};

  if (Array.isArray(raw)) {
    for (const item of raw as Array<Record<string, unknown>>) {
      const fieldName = String(item.field ?? item.path ?? '');
      const fieldMessage = String(
        item.message ??
          (typeof errorObject?.message === 'string' ? errorObject.message : 'Validation error')
      );
      if (fieldName === 'name' || fieldName === 'username') fieldErrors.name = fieldMessage;
      else if (fieldName === 'email') fieldErrors.email = fieldMessage;
      else if (fieldName === 'password') fieldErrors.password = fieldMessage;
      else if (fieldName === 'avatar.url' || fieldName === 'avatarUrl')
        fieldErrors.avatarUrl = fieldMessage;
    }
  } else if (raw && typeof raw === 'object') {
    const map = raw as Record<string, unknown>;
    if (typeof map.name === 'string') fieldErrors.name = map.name;
    if (typeof map.email === 'string') fieldErrors.email = map.email;
    if (typeof map.password === 'string') fieldErrors.password = map.password;
    const avatarUrlMessage =
      (map['avatar.url'] as string | undefined) ?? (map.avatarUrl as string | undefined);
    if (typeof avatarUrlMessage === 'string') fieldErrors.avatarUrl = avatarUrlMessage;
  }

  if (Object.keys(fieldErrors).length) return fieldErrors;

  const status =
    typeof (errorObject as any)?.status === 'number'
      ? ((errorObject as any).status as number)
      : undefined;

  const topMessage =
    typeof (errorObject as any)?.message === 'string'
      ? ((errorObject as any).message as string)
      : undefined;

  const messageL = (topMessage || '').toLowerCase();
  const looksLikeExistingUser =
    status === 409 ||
    messageL.includes('already exists') ||
    messageL.includes('exists') ||
    messageL.includes('duplicate') ||
    messageL.includes('registered');

  if (looksLikeExistingUser) {
    return {
      email: topMessage || 'An account with this email already exists.',
    };
  }

  return undefined;
}
