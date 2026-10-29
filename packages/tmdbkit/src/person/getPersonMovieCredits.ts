import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { PersonMovieCredits } from "./types/PersonCredits.js";

export const getPersonMovieCreditsSchema = v.object({
  personId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Movie Credits](https://developer.themoviedb.org/reference/person-movie-credits)
 *
 * **GET** `/person/{person_id}/movie_credits`
 */
export const getPersonMovieCredits: Fetcher<
  typeof getPersonMovieCreditsSchema,
  PersonMovieCredits
> = async ({ personId, params }, options) =>
  get(`/person/${personId}/movie_credits`, params, options);
