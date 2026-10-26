import { addParams } from "./addParams.js";
import { endpoint } from "./TmdbSession.js";
import type { RequestParams } from "./addParams.js";

/**
 * Build a full URL against the TMDB endpoint, appending query params.
 *
 * @param resource - The path, e.g. `/search/movie` or `search/movie`.
 * @param params - Optional query params (camelCase keys are converted to
 *   snake_case).
 * @param base - Optional base URL override (defaults to the TMDB endpoint).
 */
/** @__NO_SIDE_EFFECTS__ */
export const buildURL = (
  resource: string,
  params?: RequestParams,
  base?: string
): URL =>
  addParams(
    new URL(resource.replace(/^\//, ``), base ?? endpoint),
    params ?? {}
  );
