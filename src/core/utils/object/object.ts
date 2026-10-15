/**
 * Splits a dot path into its non-empty segments. `""` yields `[]` (the
 * root).
 *
 * @since 0.5.0
 */
export function splitPath(path: string): string[] {
  return path.split('.').filter((segment) => segment.length > 0);
}

/**
 * Deep-clones a JSON value, preferring the structured-clone algorithm and
 * falling back to a `JSON` round-trip on older runtimes.
 *
 * @since 0.5.0
 */
export function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}
