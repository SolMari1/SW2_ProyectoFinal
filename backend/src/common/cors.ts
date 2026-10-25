/** Convierte "http://a.com, http://b.com" en una lista limpia de orígenes. */
export function parseAllowedOrigins(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
