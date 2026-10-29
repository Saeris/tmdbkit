import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import {
  pageEntries,
  pagedResults,
  type PagedResults
} from "../../types/PagedResults.js";

export const movieListItemEntries = {
  adult: v.boolean(),
  backdropPath: v.nullable(v.string()),
  /** Ids into `getMovieGenres`. */
  genreIds: v.array(integer),
  id: integer,
  originalLanguage: v.string(),
  originalTitle: v.string(),
  /** `""` when TMDB has none. */
  overview: v.string(),
  popularity: v.number(),
  posterPath: v.nullable(v.string()),
  /** `YYYY-MM-DD`, or `""` when unknown. */
  releaseDate: v.string(),
  softcore: v.boolean(),
  title: v.string(),
  video: v.boolean(),
  voteAverage: v.number(),
  voteCount: integer
} as const;

const _movieListItemSchema = v.object(movieListItemEntries);

export interface MovieListItem extends v.InferOutput<
  typeof _movieListItemSchema
> {}

/**
 * ### Movie List Item
 *
 * The summary of a movie that list, search and discover endpoints return. Fetch `getMovie` for the details.
 */
export const movieListItemSchema = schema<MovieListItem>(_movieListItemSchema);

export const movieMediaListItemEntries = {
  ...movieListItemEntries,
  mediaType: v.literal(`movie`)
} as const;

const _movieMediaListItemSchema = v.object(movieMediaListItemEntries);

export interface MovieMediaListItem extends v.InferOutput<
  typeof _movieMediaListItemSchema
> {}

/** A {@link MovieListItem} tagged with `mediaType: "movie"`, as endpoints that can mix media types return it (recommendations, trending, collections, lists). */
export const movieMediaListItemSchema = schema<MovieMediaListItem>(
  _movieMediaListItemSchema
);

export interface PagedMovieResults extends PagedResults<MovieListItem> {}

/** A page of {@link MovieListItem}s. */
export const pagedMovieResultsSchema = schema<PagedMovieResults>(
  pagedResults(movieListItemSchema)
);

export interface PagedMovieMediaResults extends PagedResults<MovieMediaListItem> {}

/** A page of {@link MovieMediaListItem}s. */
export const pagedMovieMediaResultsSchema = schema<PagedMovieMediaResults>(
  pagedResults(movieMediaListItemSchema)
);

const _datedMovieResultsSchema = v.object({
  ...pageEntries,
  results: v.array(movieListItemSchema),
  /** The release-date window the list covers, as `YYYY-MM-DD`. */
  dates: v.object({ maximum: v.string(), minimum: v.string() })
});

export interface DatedMovieResults extends v.InferOutput<
  typeof _datedMovieResultsSchema
> {}

/** A page of {@link MovieListItem}s with the date window it covers (`getNowPlayingMovies`, `getUpcomingMovies`). */
export const datedMovieResultsSchema = schema<DatedMovieResults>(
  _datedMovieResultsSchema
);
