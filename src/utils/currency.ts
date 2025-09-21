/**
 * Currency formatting utilities for Norwegian Krone (NOK).
 * No behavioral changes—uses Intl.NumberFormat with nb-NO locale.
 */

/** Shared NOK formatter (0 decimals, locale nb-NO). */
const NORWEGIAN_KRONE_FORMATTER = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
});

/**
 * Format a number as NOK for the nb-NO locale.
 *
 * @remarks
 * - Null/undefined or non-finite values are treated as `0`.
 * - `maximumFractionDigits: 0` means values are **rounded** to whole kroner.
 * - Negative values are supported and will include a minus sign.
 *
 * @param amount - The numeric amount to format, in kroner.
 * @returns A localized NOK string, e.g. "kr 1 250".
 */
export function formatCurrencyNOK(amount: number | null | undefined): string {
  const normalizedAmount =
    typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
  return NORWEGIAN_KRONE_FORMATTER.format(normalizedAmount);
}
