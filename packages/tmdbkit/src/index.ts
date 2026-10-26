/**
 * @saeris/tmdbkit — a modern, type-safe TMDB API client.
 *
 * Built per mediameta docs/03-tmdb-api.md. The request layer (session,
 * rate limiting, key conversion, typed fetchers) is exported here; domain
 * operations and entities land as implementation proceeds.
 */

export * from "./requests/index.js";
