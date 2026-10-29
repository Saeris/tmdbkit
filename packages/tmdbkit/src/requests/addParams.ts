import { toSnakeCase } from "../utils/toSnakeCase.js";

/**
 * The shape of query params accepted by the typed helpers. `null`/`undefined` values are skipped.
 */
export type RequestParams = Partial<
  Record<
    string,
    number[] | string[] | boolean | number | string | null | undefined
  >
>;

/**
 * Append query params to a URL. Keys are converted from camelCase to snake_case (TMDB's wire format).
 *
 * Arrays are **comma-joined**, never repeated: TMDB reads lists as one comma-separated value (`append_to_response=credits,images`, `with_genres=28,12` meaning AND). For OR-logic TMDB uses `|`, which callers pass as a single string (`with_genres: "28|12"`).
 */
export const addParams = (url: URL, params: RequestParams): URL => {
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    url.searchParams.set(
      toSnakeCase(key),
      Array.isArray(value) ? value.join(`,`) : String(value)
    );
  }
  return url;
};
