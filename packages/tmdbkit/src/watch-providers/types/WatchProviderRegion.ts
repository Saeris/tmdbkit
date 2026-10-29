import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { countrySchema } from "../../configuration/types/Country.js";

const _watchProviderRegionsSchema = v.object({
  results: v.array(countrySchema)
});

export interface WatchProviderRegions extends v.InferOutput<
  typeof _watchProviderRegionsSchema
> {}

/**
 * ### Watch Provider Regions
 *
 * The countries TMDB has watch-provider data for (`getWatchProviderRegions`).
 */
export const watchProviderRegionsSchema = schema<WatchProviderRegions>(
  _watchProviderRegionsSchema
);
