import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import { isoDate } from "../validations/isoDate.js";
import type { ChangeList } from "../types/ChangeList.js";

export const getTvChangeListSchema = v.object({
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
 * ### [TV List](https://developer.themoviedb.org/reference/changes-tv-list)
 *
 * **GET** `/tv/changes`
 */
export const getTvChangeList: Fetcher<
  typeof getTvChangeListSchema,
  ChangeList
> = async ({ params }, options) => get(`/tv/changes`, params, options);
