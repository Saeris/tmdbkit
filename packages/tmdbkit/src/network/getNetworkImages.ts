import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { LogoImages } from "../types/Images.js";

export const getNetworkImagesSchema = v.object({
  networkId: tmdbId
});

/**
 * ### [Images](https://developer.themoviedb.org/reference/alternative-names-copy)
 *
 * **GET** `/network/{network_id}/images`
 */
export const getNetworkImages: Fetcher<
  typeof getNetworkImagesSchema,
  LogoImages
> = async ({ networkId }, options) =>
  get(`/network/${networkId}/images`, undefined, options);
