import { toSnakeCase } from "../utils/toSnakeCase.js";

type ParamValue =
  | number[]
  | string[]
  | boolean
  | number
  | string
  | null
  | undefined;

/**
 * The shape of query params accepted by the typed helpers. `null`/`undefined` values are skipped. A nested object is a range: `{ voteAverage: { gte: 7, lte: 9 } }`.
 */
export type RequestParams = Partial<
  Record<string, ParamValue | Partial<Record<string, ParamValue>>>
>;

const serialize = (value: Exclude<ParamValue, null | undefined>): string =>
  Array.isArray(value) ? value.join(`,`) : String(value);

/**
 * Append query params to a URL. Keys are converted from camelCase to snake_case (TMDB's wire format).
 *
 * Arrays are **comma-joined**, never repeated: TMDB reads lists as one comma-separated value (`append_to_response=credits,images`, `with_genres=28,12` meaning AND). For OR-logic TMDB uses `|`, which callers pass as a single string (`with_genres: "28|12"`).
 *
 * Nested objects become TMDB's dotted range params, the way the old tmdb-api's `buildNumberRange`/`buildDateRange` did: `{ primaryReleaseDate: { gte: "2020-01-01" } }` → `primary_release_date.gte=2020-01-01`.
 */
export const addParams = (url: URL, params: RequestParams): URL => {
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    if (typeof value === `object` && !Array.isArray(value)) {
      for (const [bound, limit] of Object.entries(value)) {
        if (limit === null || limit === undefined) continue;
        url.searchParams.set(`${toSnakeCase(key)}.${bound}`, serialize(limit));
      }
      continue;
    }
    url.searchParams.set(toSnakeCase(key), serialize(value));
  }
  return url;
};
