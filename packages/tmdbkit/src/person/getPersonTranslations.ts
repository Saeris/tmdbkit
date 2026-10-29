import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { PersonTranslations } from "./types/PersonTranslations.js";

export const getPersonTranslationsSchema = v.object({
  personId: tmdbId
});

/**
 * ### [Translations](https://developer.themoviedb.org/reference/translations)
 *
 * **GET** `/person/{person_id}/translations`
 */
export const getPersonTranslations: Fetcher<
  typeof getPersonTranslationsSchema,
  PersonTranslations
> = async ({ personId }, options) =>
  get(`/person/${personId}/translations`, undefined, options);
