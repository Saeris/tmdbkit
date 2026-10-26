import { isObject } from "./isObject.js";
import { toSnakeCase } from "./toSnakeCase.js";

/** The uppercase ASCII letters, for the camel→snake split. */
type Upper =
  | `A`
  | `B`
  | `C`
  | `D`
  | `E`
  | `F`
  | `G`
  | `H`
  | `I`
  | `J`
  | `K`
  | `L`
  | `M`
  | `N`
  | `O`
  | `P`
  | `Q`
  | `R`
  | `S`
  | `T`
  | `U`
  | `V`
  | `W`
  | `X`
  | `Y`
  | `Z`;

/**
 * Walk a `camelCase` literal, inserting `_` before each uppercase letter and
 * lowercasing it — matching {@link toSnakeCase}'s runtime. `Started` tracks
 * whether we've emitted any character yet, so a leading capital (e.g. `Foo`)
 * doesn't get a leading underscore (→ `foo`, not `_foo`).
 */
type SnakeWalk<
  S extends string,
  Started extends boolean = false
> = S extends `${infer Head}${infer Tail}`
  ? Head extends Upper
    ? `${Started extends true ? `_` : ``}${Lowercase<Head>}${SnakeWalk<Tail, true>}`
    : `${Head}${SnakeWalk<Tail, true>}`
  : S;

/** Convert a `camelCase` string-literal type to `snake_case`. Self-contained;
 * mirrors {@link toSnakeCase} (the only transform we apply to API keys). */
type SnakeCase<S extends string> = SnakeWalk<S>;

/**
 * Recursively snake-case the keys of an object/array type. Mirrors
 * {@link toSnakeKeys}'s runtime. The only inputs are plain nested TMDB API
 * JSON, so no Set/tuple/options handling is needed.
 */
export type SnakeKeys<T> =
  T extends ReadonlyArray<infer U>
    ? Array<SnakeKeys<U>>
    : T extends object
      ? {
          [K in keyof T as K extends string ? SnakeCase<K> : K]: SnakeKeys<
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
      result[toSnakeCase(key)] = convert(val);
    }
    return result;
  }

  return value;
};

export const toSnakeKeys = <T extends object>(o: T): SnakeKeys<T> => {
  // Recursive key remapping can't be proven at the type level.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return convert(o) as SnakeKeys<T>;
};
