import * as v from "valibot";
import { schema } from "../../validations/schema.js";

export const searchMovieResultEntries = {
  /** whether the movie is intended for adults only */
  adult: v.boolean(),
  /** the path of the movie backdrop image */
  backdropPath: v.nullish(v.string()),
  /** the genre ids the movie is tagged with */
  genreIds: v.array(v.number()),
  /** the movie id */
  id: v.number(),
  /** the original language of the movie */
  originalLanguage: v.string(),
  /** the original title of the movie */
  originalTitle: v.string(),
  /** the overview of the movie */
  overview: v.string(),
  /** the popularity of the movie */
  popularity: v.number(),
  /** the path of the movie poster image */
  posterPath: v.nullish(v.string()),
  /** the release date of the movie */
  releaseDate: v.nullish(v.string()),
  /** the title of the movie */
  title: v.string(),
  /** whether the movie is a video */
  video: v.boolean(),
  /** the average vote for the movie */
  voteAverage: v.number(),
  /** the number of votes for the movie */
  voteCount: v.number()
} as const;

const _searchMovieResultSchema = v.object(searchMovieResultEntries);

export interface SearchMovieResult extends v.InferOutput<
  typeof _searchMovieResultSchema
> {}

/**
 * ### [Search Movie](https://www.themoviedb.org/documentation/api/search)
 *
 * A movie result from the search endpoint.
 */
export const searchMovieResultSchema = schema<SearchMovieResult>(
  _searchMovieResultSchema
);
