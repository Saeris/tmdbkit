import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _watchProviderSchema = v.object({
  /** Sort order per country, keyed by ISO 3166-1 code. */
  displayPriorities: v.record(v.string(), integer),
  displayPriority: integer,
  logoPath: v.nullable(v.string()),
  providerId: integer,
  providerName: v.string()
});

export interface WatchProvider extends v.InferOutput<
  typeof _watchProviderSchema
> {}

const _watchProviderListSchema = v.object({
  results: v.array(schema<WatchProvider>(_watchProviderSchema))
});

export interface WatchProviderList extends v.InferOutput<
  typeof _watchProviderListSchema
> {}

/**
 * ### Watch Provider List
 *
 * Every streaming, rental and purchase service TMDB tracks for movies or TV (`getMovieWatchProviderList`, `getTvWatchProviderList`).
 */
export const watchProviderListSchema = schema<WatchProviderList>(
  _watchProviderListSchema
);
