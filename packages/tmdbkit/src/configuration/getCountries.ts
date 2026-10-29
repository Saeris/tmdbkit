import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { Countries } from "./types/Country.js";

export const getCountriesSchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Countries](https://developer.themoviedb.org/reference/configuration-countries)
 *
 * **GET** `/configuration/countries`
 */
export const getCountries: Fetcher<
  typeof getCountriesSchema,
  Countries
> = async ({ params }, options) =>
  get(`/configuration/countries`, params, options);
