import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { MovieDetails } from "./types/MovieDetails.js";

export const getMovieSchema = v.object({
  movieId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        /** Fetch these related resources in the same request; each comes back under its own key. At most 20. */
        appendToResponse: v.pipe(
          v.array(
            v.picklist([
              `alternative_titles`,
              `changes`,
              `credits`,
              `external_ids`,
              `images`,
              `keywords`,
              `lists`,
              `recommendations`,
              `release_dates`,
              `reviews`,
              `similar`,
              `translations`,
              `videos`,
              `watch/providers`
            ])
          ),
          v.maxLength(20)
        )
      })
    )
  )
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/movie-details)
 *
 * **GET** `/movie/{movie_id}`
 */
export const getMovie: Fetcher<typeof getMovieSchema, MovieDetails> = async (
  { movieId, params },
  options
) => get(`/movie/${movieId}`, params, options);
