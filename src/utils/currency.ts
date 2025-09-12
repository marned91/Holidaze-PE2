const NOK_FORMATTER = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
});

export function formatCurrencyNOK(value: number | null | undefined): string {
  const amount =
    typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return NOK_FORMATTER.format(amount);
}
