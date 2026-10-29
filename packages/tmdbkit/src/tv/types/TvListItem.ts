import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { pagedResults, type PagedResults } from "../../types/PagedResults.js";

export const tvListItemEntries = {
  adult: v.boolean(),
  backdropPath: v.nullable(v.string()),
  /** `YYYY-MM-DD`, or `""` when unknown. */
  firstAirDate: v.string(),
  /** Ids into `getTvGenres`. */
  genreIds: v.array(integer),
  id: integer,
  name: v.string(),
  /** ISO 3166-1 codes. */
  originCountry: v.array(v.string()),
  originalLanguage: v.string(),
  originalName: v.string(),
  /** `""` when TMDB has none. */
  overview: v.string(),
  popularity: v.number(),
  posterPath: v.nullable(v.string()),
  softcore: v.boolean(),
  voteAverage: v.number(),
  voteCount: integer
} as const;

const _tvListItemSchema = v.object(tvListItemEntries);

export interface TvListItem extends v.InferOutput<typeof _tvListItemSchema> {}

/**
 * ### TV List Item
 *
 * The summary of a TV series that list, search and discover endpoints return. Fetch `getTvSeries` for the details.
 */
export const tvListItemSchema = schema<TvListItem>(_tvListItemSchema);

export const tvMediaListItemEntries = {
  ...tvListItemEntries,
  mediaType: v.literal(`tv`)
} as const;

const _tvMediaListItemSchema = v.object(tvMediaListItemEntries);

export interface TvMediaListItem extends v.InferOutput<
  typeof _tvMediaListItemSchema
> {}

/** A {@link TvListItem} tagged with `mediaType: "tv"`, as endpoints that can mix media types return it. */
export const tvMediaListItemSchema = schema<TvMediaListItem>(
  _tvMediaListItemSchema
);

export interface PagedTvResults extends PagedResults<TvListItem> {}

/** A page of {@link TvListItem}s. */
export const pagedTvResultsSchema = schema<PagedTvResults>(
  pagedResults(tvListItemSchema)
);

export interface PagedTvMediaResults extends PagedResults<TvMediaListItem> {}

/** A page of {@link TvMediaListItem}s (`getTvSeriesRecommendations`, `getTrendingTvSeries`). */
export const pagedTvMediaResultsSchema = schema<PagedTvMediaResults>(
  pagedResults(tvMediaListItemSchema)
);
