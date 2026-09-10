/**
 * Helpers for Supabase embedded relations.
 *
 * PostgREST returns an embedded to-one relation (`alerts(monitored_urls(...))`)
 * as an array in the generated types, even though at most one row can ever come
 * back. Left untyped this leaks `T[]` into components that expect `T`, which is
 * where the `monitored_urls` type mismatches came from.
 *
 * `toOne` normalizes it in one place instead of casting at every call site.
 */

/** Unwraps an embedded to-one relation to a single row, or null. */
export function toOne<T>(relation: T | T[] | null | undefined): T | null {
  if (!relation) return null
  return Array.isArray(relation) ? relation[0] ?? null : relation
}

/**
 * Flattens the embedded relation named by `key` on every row of `rows`.
 *
 * @example
 *   const alerts = flattenToOne(data, 'monitored_urls')
 *   alerts[0].monitored_urls?.name  // string | undefined, not an array
 */
export function flattenToOne<Row extends Record<string, unknown>, Key extends keyof Row>(
  rows: Row[] | null | undefined,
  key: Key
): (Omit<Row, Key> & Record<Key, NonNullable<ExtractRelation<Row[Key]>> | null>)[] {
  return (rows ?? []).map((row) => ({
    ...row,
    [key]: toOne(row[key] as never),
  })) as (Omit<Row, Key> & Record<Key, NonNullable<ExtractRelation<Row[Key]>> | null>)[]
}

/** Element type of an embedded relation, whether it arrived as `T` or `T[]`. */
type ExtractRelation<T> = T extends readonly (infer Item)[] ? Item : T
