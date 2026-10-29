import { isObject } from "./isObject.js";
import { toCamelCase } from "./toCamelCase.js";

/** Whether a one-character string is a letter (it has a case). */
type IsLetter<C extends string> =
  Lowercase<C> extends Uppercase<C> ? false : true;

/** {@link CamelCase} after any leading `_`: an `_` before a letter is dropped and the letter capitalised; an `_` before anything else stays. */
type CamelTail<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? Tail extends `${infer First}${string}`
    ? IsLetter<First> extends true
      ? `${Head}${CamelTail<Capitalize<Tail>>}`
      : `${Head}_${CamelTail<Tail>}`
    : S
  : S;

/**
 * Convert a `snake_case` string-literal type to `camelCase`, matching exactly what {@link toCamelCase} does at runtime: `poster_path` → `posterPath`, while `iso_3166_1` and `_id` are unchanged (see `toCamelCase` for why).
 */
type CamelCase<S extends string> = S extends `_${infer Rest}`
  ? `_${CamelTail<Rest>}`
  : CamelTail<S>;

/**
 * Recursively camel-case the keys of an object/array type. Mirrors
 * {@link toCamelKeys}'s runtime: arrays map element-wise, plain objects remap
 * their keys, and leaf values pass through unchanged.
 */
export type CamelKeys<T> =
  T extends ReadonlyArray<infer U>
    ? Array<CamelKeys<U>>
    : T extends object
      ? {
          [K in keyof T as K extends string ? CamelCase<K> : K]: CamelKeys<
            T[K]
          >;
        }
      : T;

const convert = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(convert);
  } else if (isObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[toCamelCase(key)] = convert(val);
    }
    return result;
  }

  return value;
};

export const toCamelKeys = <T extends object>(o: T): CamelKeys<T> => {
  // Recursive key remapping can't be proven at the type level.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return convert(o) as CamelKeys<T>;
};
