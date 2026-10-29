import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedPersonResults } from "../person/types/PersonListItem.js";

export const searchPeopleSchema = v.object({
  query: v.string(),
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
 * ### [Person](https://developer.themoviedb.org/reference/search-person)
 *
 * **GET** `/search/person`
 */
export const searchPeople: Fetcher<
  typeof searchPeopleSchema,
  PagedPersonResults
> = async ({ query, params }, options) =>
  get(`/search/person`, { ...params, query }, options);
