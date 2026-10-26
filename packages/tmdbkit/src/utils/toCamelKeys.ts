import { isObject } from "./isObject.js";
import { toCamelCase } from "./toCamelCase.js";

/**
 * Convert a `snake_case` string-literal type to `camelCase`, matching exactly
 * what {@link toCamelCase} does at runtime: each `_x` becomes `X`.
 * Self-contained (no general word-splitting); we only ever convert
 * underscore-delimited TMDB API keys, so this is all the casing we need.
 */
type CamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${CamelCase<Capitalize<Tail>>}`
  : S;

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
