/**
 * camelCase a TMDB key: each `_` followed by a letter is dropped and the letter capitalised (`poster_path` → `posterPath`). Two kinds of key are left alone, by design (tmdbkit's plan, 2026-10-28):
 *
 * - an `_` before a digit, so ISO-code keys keep TMDB's documented names (`iso_3166_1`, not `iso31661`);
 * - a leading `_`, which marks an internal key rather than a word break (`_id` stays `_id`).
 */
export const toCamelCase = (str: string): string =>
  str.replace(/(?<!^)_(?<char>[a-zA-Z])/g, (g) => g[1].toUpperCase());
