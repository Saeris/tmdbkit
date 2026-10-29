import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { PersonDetails } from "./types/PersonDetails.js";

export const getPersonSchema = v.object({
  personId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        /** Fetch these related resources in the same request; each comes back under its own key. At most 20. */
        appendToResponse: v.pipe(
          v.array(
            v.picklist([
              `changes`,
              `combined_credits`,
              `external_ids`,
              `images`,
              `movie_credits`,
              `tagged_images`,
              `translations`,
              `tv_credits`
            ])
          ),
          v.maxLength(20)
        )
      })
    )
  )
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/person-details)
 *
 * **GET** `/person/{person_id}`
 */
export const getPerson: Fetcher<typeof getPersonSchema, PersonDetails> = async (
  { personId, params },
  options
) => get(`/person/${personId}`, params, options);
