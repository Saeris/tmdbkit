import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { NetworkDetails } from "./types/NetworkDetails.js";

export const getNetworkSchema = v.object({
  networkId: tmdbId
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/network-details)
 *
 * **GET** `/network/{network_id}`
 */
export const getNetwork: Fetcher<
  typeof getNetworkSchema,
  NetworkDetails
> = async ({ networkId }, options) =>
  get(`/network/${networkId}`, undefined, options);
