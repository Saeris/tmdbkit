import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedMovieResults } from "../movie/types/MovieListItem.js";

export const getKeywordMoviesSchema = v.object({
  keywordId: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        includeAdult: v.boolean(),
        language: v.string(),
        page: integer
      })
    )
  )
});

/**
 * ### [Movies](https://developer.themoviedb.org/reference/keyword-movies)
 *
 * **GET** `/keyword/{keyword_id}/movies`
 */
export const getKeywordMovies: Fetcher<
  typeof getKeywordMoviesSchema,
  PagedMovieResults
> = async ({ keywordId, params }, options) =>
  get(`/keyword/${encodeURIComponent(keywordId)}/movies`, params, options);
