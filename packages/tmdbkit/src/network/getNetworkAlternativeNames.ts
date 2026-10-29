import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { AlternativeNames } from "../types/AlternativeNames.js";

export const getNetworkAlternativeNamesSchema = v.object({
  networkId: tmdbId
});

/**
 * ### [Alternative Names](https://developer.themoviedb.org/reference/details-copy)
 *
 * **GET** `/network/{network_id}/alternative_names`
 */
export const getNetworkAlternativeNames: Fetcher<
  typeof getNetworkAlternativeNamesSchema,
  AlternativeNames
> = async ({ networkId }, options) =>
  get(`/network/${networkId}/alternative_names`, undefined, options);
