/** Shared NOK formatter (0 decimals, locale nb-NO). */
const NORWEGIAN_KRONE_FORMATTER = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
});

/**
 * Formats a number as Norwegian Krone (NOK) using the `nb-NO` locale.
 *
 * Behavior:
 * - Non-finite / nullish inputs are treated as `0`.
 * - Outputs whole kroner (`maximumFractionDigits: 0`, rounded).
 * - Negative values include a leading minus sign.
 *
 * @param amount - Amount in kroner.
 * @returns Localized NOK string, e.g., `"kr 1 250"`.
 */
export function formatCurrencyNOK(amount: number | null | undefined): string {
  const normalizedAmount = typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
  return NORWEGIAN_KRONE_FORMATTER.format(normalizedAmount);
}
