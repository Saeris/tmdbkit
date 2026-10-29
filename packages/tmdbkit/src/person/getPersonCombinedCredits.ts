import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { PersonCombinedCredits } from "./types/PersonCredits.js";

export const getPersonCombinedCreditsSchema = v.object({
  personId: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Combined Credits](https://developer.themoviedb.org/reference/person-combined-credits)
 *
 * **GET** `/person/{person_id}/combined_credits`
 */
export const getPersonCombinedCredits: Fetcher<
  typeof getPersonCombinedCreditsSchema,
  PersonCombinedCredits
> = async ({ personId, params }, options) =>
  get(
    `/person/${encodeURIComponent(personId)}/combined_credits`,
    params,
    options
  );
