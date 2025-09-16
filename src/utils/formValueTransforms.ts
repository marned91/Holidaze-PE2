export function setValueAsTrim(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}
