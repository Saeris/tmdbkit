import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { castCreditEntries, crewCreditSchema } from "../../types/Credit.js";

const _movieCastCreditSchema = v.object({
  ...castCreditEntries,
  /** A movie-only id for the cast entry (credits are better identified by `creditId`). */
  castId: integer
});

export interface MovieCastCredit extends v.InferOutput<
  typeof _movieCastCreditSchema
> {}

/**
 * ### Movie Cast Credit
 *
 * A person cast in a movie.
 */
export const movieCastCreditSchema = schema<MovieCastCredit>(
  _movieCastCreditSchema
);

const _movieCreditsSchema = v.object({
  id: integer,
  cast: v.array(movieCastCreditSchema),
  crew: v.array(crewCreditSchema)
});

export interface MovieCredits extends v.InferOutput<
  typeof _movieCreditsSchema
> {}

/**
 * ### Movie Credits
 *
 * A movie's cast, in billing order, and crew (`getMovieCredits`).
 */
export const movieCreditsSchema = schema<MovieCredits>(_movieCreditsSchema);
