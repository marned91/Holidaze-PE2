/** Returns a user-friendly message for booking update errors. */
export function mapUpdateBookingErrorMessage(error: unknown): string {
  const fallback =
    'Could not update booking. Please check your dates and try again.';

  const obj =
    error && typeof error === 'object'
      ? (error as Record<string, unknown>)
      : null;

  const serverMessage =
    typeof obj?.message === 'string' ? obj.message : undefined;

  // Some responses include details.errors[]
  const details =
    obj?.details && typeof obj.details === 'object'
      ? (obj.details as Record<string, unknown>)
      : undefined;

  const items = Array.isArray(details?.errors)
    ? (details!.errors as Array<Record<string, unknown>>)
    : [];

  const combined = [serverMessage, ...items.map((i) => String(i.message ?? ''))]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (combined.includes('datefrom') && combined.includes('past')) {
    return 'Start date cannot be in the past. Please choose a future date.';
  }
  if (
    combined.includes('dateto') &&
    (combined.includes('before') || combined.includes('earlier'))
  ) {
    return 'End date must be after the start date.';
  }

  return serverMessage ?? fallback;
}
