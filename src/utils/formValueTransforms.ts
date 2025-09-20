export function setValueAsTrim(value: string): string;
export function setValueAsTrim<T>(value: T): T;
export function setValueAsTrim<T>(value: T): T {
  return (typeof value === 'string' ? value.trim() : value) as T;
}
