import * as v from "valibot";
import { schema } from "../../validations/schema.js";

export const searchTvResultEntries = {
  /** whether the show is intended for adults only */
  adult: v.boolean(),
  /** the path of the show backdrop image */
  backdropPath: v.nullish(v.string()),
  /** the genre ids the show is tagged with */
  genreIds: v.array(v.number()),
  /** the show id */
  id: v.number(),
  /** the origin countries of the show */
  originCountry: v.array(v.string()),
  /** the original language of the show */
  originalLanguage: v.string(),
  /** the original name of the show */
  originalName: v.string(),
  /** the overview of the show */
  overview: v.string(),
  /** the popularity of the show */
  popularity: v.number(),
  /** the path of the show poster image */
  posterPath: v.nullish(v.string()),
  /** the date the show first aired */
  firstAirDate: v.nullish(v.string()),
  /** the name of the show */
  name: v.string(),
  /** the average vote for the show */
  voteAverage: v.number(),
  /** the number of votes for the show */
  voteCount: v.number()
} as const;

const _searchTvResultSchema = v.object(searchTvResultEntries);

export interface SearchTvResult extends v.InferOutput<
  typeof _searchTvResultSchema
> {}

/**
 * ### [Search TV](https://www.themoviedb.org/documentation/api/search)
 *
 * A TV show result from the search endpoint.
 */
export const searchTvResultSchema = schema<SearchTvResult>(
  _searchTvResultSchema
);
