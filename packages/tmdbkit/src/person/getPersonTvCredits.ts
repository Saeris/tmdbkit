import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { PersonTvCredits } from "./types/PersonCredits.js";

export const getPersonTvCreditsSchema = v.object({
  personId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [TV Credits](https://developer.themoviedb.org/reference/person-tv-credits)
 *
 * **GET** `/person/{person_id}/tv_credits`
 */
export const getPersonTvCredits: Fetcher<
  typeof getPersonTvCreditsSchema,
  PersonTvCredits
> = async ({ personId, params }, options) =>
  get(`/person/${personId}/tv_credits`, params, options);
