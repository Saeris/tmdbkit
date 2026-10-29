import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _watchOptionSchema = v.object({
  displayPriority: integer,
  logoPath: v.nullable(v.string()),
  providerId: integer,
  providerName: v.string()
});

export interface WatchOption extends v.InferOutput<typeof _watchOptionSchema> {}

const watchOptions = v.exactOptional(
  v.array(schema<WatchOption>(_watchOptionSchema))
);

const _regionWatchProvidersSchema = v.object({
  /** TMDB's page for the title's providers in this region (the data comes from JustWatch). */
  link: v.string(),
  /** Included with a subscription. */
  flatrate: watchOptions,
  free: watchOptions,
  ads: watchOptions,
  rent: watchOptions,
  buy: watchOptions
});

export interface RegionWatchProviders extends v.InferOutput<
  typeof _regionWatchProvidersSchema
> {}

const _watchProvidersSchema = v.object({
  id: integer,
  /** Keyed by ISO 3166-1 country code. Each region lists only the monetization types it has (`flatrate`, `free`, `ads`, `rent`, `buy`). */
  results: v.record(
    v.string(),
    schema<RegionWatchProviders>(_regionWatchProvidersSchema)
  )
});

export interface WatchProviders extends v.InferOutput<
  typeof _watchProvidersSchema
> {}

/**
 * ### Watch Providers
 *
 * Where a movie, TV series or season can be streamed, rented or bought, per country (`getMovieWatchProviders`, …).
 */
export const watchProvidersSchema = schema<WatchProviders>(
  _watchProvidersSchema
);
