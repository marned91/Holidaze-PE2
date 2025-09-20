const NORWEGIAN_KRONE_FORMATTER = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
});

export function formatCurrencyNOK(amount: number | null | undefined): string {
  const normalizedAmount =
    typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
  return NORWEGIAN_KRONE_FORMATTER.format(normalizedAmount);
}
