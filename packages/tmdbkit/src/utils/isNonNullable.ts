export type Maybe<T> = T | null | undefined;

/**
 * Used to test whether a `Maybe` typed value is `null` or `undefined`.
 *
 * When called, the given value's type is narrowed to `NonNullable<T>`.
 */
export const isNonNullable = <T extends Maybe<unknown>>(
  val?: T
): val is NonNullable<T> => typeof val !== `undefined` && val !== null;
