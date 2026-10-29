import * as v from "valibot";
import { omitFields, schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { castCreditSchema, crewCreditSchema } from "../../types/Credit.js";
import { posterImagesSchema } from "../../types/Images.js";
import { productionCompanySchema } from "../../types/ProductionCompany.js";
import { videosSchema } from "../../types/Video.js";
import { watchProvidersSchema } from "../../watch-providers/types/WatchProviders.js";
import { aggregateCreditsSchema } from "./AggregateCredits.js";
import { tvCreditsSchema } from "./TvCredits.js";
import { tvEpisodeEntries } from "./TvEpisode.js";
import { tvSeasonExternalIdsSchema } from "./TvExternalIds.js";
import { nameOverviewTranslationsSchema } from "./TvTranslations.js";

export const tvSeasonDetailsEntries = {
  /** TMDB's internal document id, sent as `_id`. tmdbkit's camelCasing turns the leading `_i` into `I`, so it arrives as `Id`. Use `id`. */
  Id: v.string(),
  /** `YYYY-MM-DD`, or `null` when unknown. */
  airDate: v.nullable(v.string()),
  episodes: v.array(
    v.object({
      ...tvEpisodeEntries,
      showId: integer,
      crew: v.array(crewCreditSchema),
      guestStars: v.array(castCreditSchema)
    })
  ),
  id: integer,
  name: v.string(),
  networks: v.array(productionCompanySchema),
  overview: v.string(),
  posterPath: v.nullable(v.string()),
  seasonNumber: integer,
  voteAverage: v.number()
} as const;

/** What `appendToResponse` adds: each key holds the matching endpoint's response without its `id`. */
export const tvSeasonAppendedEntries = {
  aggregateCredits: v.exactOptional(omitFields(aggregateCreditsSchema, [`id`])),
  credits: v.exactOptional(omitFields(tvCreditsSchema, [`id`])),
  externalIds: v.exactOptional(omitFields(tvSeasonExternalIdsSchema, [`id`])),
  images: v.exactOptional(omitFields(posterImagesSchema, [`id`])),
  translations: v.exactOptional(
    omitFields(nameOverviewTranslationsSchema, [`id`])
  ),
  videos: v.exactOptional(omitFields(videosSchema, [`id`])),
  /** The key keeps TMDB's slash: `details["watch/providers"]`. */
  "watch/providers": v.exactOptional(omitFields(watchProvidersSchema, [`id`]))
} as const;

const _tvSeasonDetailsSchema = v.object({
  ...tvSeasonDetailsEntries,
  ...tvSeasonAppendedEntries
});

export interface TvSeasonDetails extends v.InferOutput<
  typeof _tvSeasonDetailsSchema
> {}

/**
 * ### TV Season Details
 *
 * A season with its episodes, each with crew and guest stars (`getTvSeason`), plus whatever `appendToResponse` asked for.
 */
export const tvSeasonDetailsSchema = schema<TvSeasonDetails>(
  _tvSeasonDetailsSchema
);
