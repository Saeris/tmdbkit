import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { ListsContaining } from "../list/types/ListsContaining.js";

export const getTvSeriesListsSchema = v.object({
  seriesId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        page: integer
      })
    )
  )
});

/**
 * ### [Lists](https://developer.themoviedb.org/reference/lists-copy)
 *
 * **GET** `/tv/{series_id}/lists`
 */
export const getTvSeriesLists: Fetcher<
  typeof getTvSeriesListsSchema,
  ListsContaining
> = async ({ seriesId, params }, options) =>
  get(`/tv/${seriesId}/lists`, params, options);
