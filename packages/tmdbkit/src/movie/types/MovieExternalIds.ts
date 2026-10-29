import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _movieExternalIdsSchema = v.object({
  id: integer,
  /** `tt…`, or `null` when unknown. */
  imdbId: v.nullable(v.string()),
  wikidataId: v.nullable(v.string()),
  facebookId: v.nullable(v.string()),
  instagramId: v.nullable(v.string()),
  twitterId: v.nullable(v.string())
});

export interface MovieExternalIds extends v.InferOutput<
  typeof _movieExternalIdsSchema
> {}

/**
 * ### Movie External IDs
 *
 * A movie's ids on other sites (`getMovieExternalIds`). Each is `null` when TMDB doesn't have it.
 */
export const movieExternalIdsSchema = schema<MovieExternalIds>(
  _movieExternalIdsSchema
);
