import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import { isoDate } from "../validations/isoDate.js";
import type { ChangeList } from "../types/ChangeList.js";

export const getMovieChangeListSchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        endDate: isoDate,
        page: integer,
        startDate: isoDate
      })
    )
  )
});

/**
 * ### [Movie List](https://developer.themoviedb.org/reference/changes-movie-list)
 *
 * **GET** `/movie/changes`
 */
export const getMovieChangeList: Fetcher<
  typeof getMovieChangeListSchema,
  ChangeList
> = async ({ params }, options) => get(`/movie/changes`, params, options);
