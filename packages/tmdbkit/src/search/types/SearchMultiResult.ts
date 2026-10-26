import * as v from "valibot";
import { schema } from "../../validations/schema.js";

export const searchMultiResultEntries = {
  /** whether the media is intended for adults only */
  adult: v.boolean(),
  /** the path of the media backdrop image */
  backdropPath: v.nullish(v.string()),
  /** the media id */
  id: v.number(),
  /** the title of the media (movies) */
  title: v.nullish(v.string()),
  /** the original language of the media */
  originalLanguage: v.nullish(v.string()),
  /** the original title of the media (movies) */
  originalTitle: v.nullish(v.string()),
  /** the overview of the media */
  overview: v.nullish(v.string()),
  /** the path of the media poster image */
  posterPath: v.nullish(v.string()),
  /** the type of media (movie, tv, or person) */
  mediaType: v.string(),
  /** the genre ids the media is tagged with */
  genreIds: v.nullish(v.array(v.number())),
  /** the popularity of the media */
  popularity: v.number(),
  /** the release date of the media (movies) */
  releaseDate: v.nullish(v.string()),
  /** whether the media is a video (movies) */
  video: v.nullish(v.boolean()),
  /** the average vote for the media */
  voteAverage: v.number(),
  /** the number of votes for the media */
  voteCount: v.number(),
  /** the name of the media (tv shows and people) */
  name: v.nullish(v.string()),
  /** the original name of the media (tv shows and people) */
  originalName: v.nullish(v.string())
} as const;

const _searchMultiResultSchema = v.object(searchMultiResultEntries);

export interface SearchMultiResult extends v.InferOutput<
  typeof _searchMultiResultSchema
> {}

/**
 * ### [Search Multi](https://www.themoviedb.org/documentation/api/search)
 *
 * A multi-search result (movie, tv show, or person).
 */
export const searchMultiResultSchema = schema<SearchMultiResult>(
  _searchMultiResultSchema
);
