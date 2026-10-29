import * as v from "valibot";
import { omitFields, schema } from "../../validations/schema.js";
import { castCreditSchema, crewCreditSchema } from "../../types/Credit.js";
import { stillImagesSchema } from "../../types/Images.js";
import { videosSchema } from "../../types/Video.js";
import { tvEpisodeCreditsSchema } from "./TvCredits.js";
import { tvEpisodeEntries } from "./TvEpisode.js";
import { tvEpisodeExternalIdsSchema } from "./TvExternalIds.js";
import { nameOverviewTranslationsSchema } from "./TvTranslations.js";

export const tvEpisodeDetailsEntries = {
  ...tvEpisodeEntries,
  crew: v.array(crewCreditSchema),
  guestStars: v.array(castCreditSchema)
} as const;

/** What `appendToResponse` adds: each key holds the matching endpoint's response without its `id`. */
export const tvEpisodeAppendedEntries = {
  credits: v.exactOptional(omitFields(tvEpisodeCreditsSchema, [`id`])),
  externalIds: v.exactOptional(omitFields(tvEpisodeExternalIdsSchema, [`id`])),
  images: v.exactOptional(omitFields(stillImagesSchema, [`id`])),
  translations: v.exactOptional(
    omitFields(nameOverviewTranslationsSchema, [`id`])
  ),
  videos: v.exactOptional(omitFields(videosSchema, [`id`]))
} as const;

const _tvEpisodeDetailsSchema = v.object({
  ...tvEpisodeDetailsEntries,
  ...tvEpisodeAppendedEntries
});

export interface TvEpisodeDetails extends v.InferOutput<
  typeof _tvEpisodeDetailsSchema
> {}

/**
 * ### TV Episode Details
 *
 * One episode with its crew and guest stars (`getTvEpisode`), plus whatever `appendToResponse` asked for.
 */
export const tvEpisodeDetailsSchema = schema<TvEpisodeDetails>(
  _tvEpisodeDetailsSchema
);
