import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { PersonExternalIds } from "./types/PersonExternalIds.js";

export const getPersonExternalIdsSchema = v.object({
  personId: tmdbId
});

/**
 * ### [External IDs](https://developer.themoviedb.org/reference/person-external-ids)
 *
 * **GET** `/person/{person_id}/external_ids`
 */
export const getPersonExternalIds: Fetcher<
  typeof getPersonExternalIdsSchema,
  PersonExternalIds
> = async ({ personId }, options) =>
  get(`/person/${personId}/external_ids`, undefined, options);
