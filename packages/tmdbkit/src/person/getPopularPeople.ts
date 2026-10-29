import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedPersonResults } from "./types/PersonListItem.js";

export const getPopularPeopleSchema = v.object({
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
 * ### [Popular](https://developer.themoviedb.org/reference/person-popular-list)
 *
 * **GET** `/person/popular`
 */
export const getPopularPeople: Fetcher<
  typeof getPopularPeopleSchema,
  PagedPersonResults
> = async ({ params }, options) => get(`/person/popular`, params, options);
