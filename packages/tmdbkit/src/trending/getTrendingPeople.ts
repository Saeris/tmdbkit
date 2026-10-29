import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { PagedPersonMediaResults } from "../person/types/PersonListItem.js";

export const getTrendingPeopleSchema = v.object({
  timeWindow: v.picklist(["day", "week"]),
  params: v.exactOptional(
    v.partial(
      v.object({
        /** `ISO-639-1`-`ISO-3166-1` code */
        language: v.string()
      })
    )
  )
});

/**
 * ### [People](https://developer.themoviedb.org/reference/trending-people)
 *
 * **GET** `/trending/person/{time_window}`
 */
export const getTrendingPeople: Fetcher<
  typeof getTrendingPeopleSchema,
  PagedPersonMediaResults
> = async ({ timeWindow, params }, options) =>
  get(`/trending/person/${encodeURIComponent(timeWindow)}`, params, options);
