import { toSnakeCase } from "../utils/toSnakeCase.js";

/**
 * The shape of query params accepted by the typed helpers. Arrays produce
 * repeated keys; `null`/`undefined` values are skipped.
 */
export type RequestParams = Partial<
  Record<
    string,
    number[] | string[] | boolean | number | string | null | undefined
  >
>;

/**
 * Append query params to a URL. Keys are converted from camelCase to
 * snake_case (TMDB's wire format), and array values are appended as repeated
 * keys.
 */
export const addParams = (url: URL, params: RequestParams): URL => {
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;

    const snakeKey = toSnakeCase(key);
    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(snakeKey, String(item));
      }
    } else {
      url.searchParams.set(snakeKey, String(value));
    }
  }
  return url;
};
