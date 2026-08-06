export type ClassValue = string | number | null | false | undefined;

/** Tiny className joiner (no deps). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
