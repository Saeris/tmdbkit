import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { Person } from "../types/Person.js";

export const getPersonSchema = v.object({
  personId: v.number(),
  params: v.exactOptional(
    v.partial(
      v.object({
        appendToResponse: v.array(v.string()),
        language: v.string()
      })
    )
  )
});

/**
 * ### [Get Person](https://developer.themoviedb.org/reference/person-get-details)
 *
 * **GET** `/person/{person_id}`
 *
 * Get the primary details for a person.
 */
export const getPerson: Fetcher<typeof getPersonSchema, Person> = async ({
  personId,
  params
}) => get(`/person/${personId}`, params);
