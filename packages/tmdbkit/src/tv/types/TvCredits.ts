import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { castCreditSchema, crewCreditSchema } from "../../types/Credit.js";

const _tvCreditsSchema = v.object({
  id: integer,
  cast: v.array(castCreditSchema),
  crew: v.array(crewCreditSchema)
});

export interface TvCredits extends v.InferOutput<typeof _tvCreditsSchema> {}

/**
 * ### TV Credits
 *
 * The cast and crew of a TV series' latest season (`getTvSeriesCredits`) or of one season (`getTvSeasonCredits`). For everyone who ever appeared, see `getTvSeriesAggregateCredits`.
 */
export const tvCreditsSchema = schema<TvCredits>(_tvCreditsSchema);

const _tvEpisodeCreditsSchema = v.object({
  id: integer,
  cast: v.array(castCreditSchema),
  crew: v.array(crewCreditSchema),
  guestStars: v.array(castCreditSchema)
});

export interface TvEpisodeCredits extends v.InferOutput<
  typeof _tvEpisodeCreditsSchema
> {}

/** An episode's cast, crew and guest stars (`getTvEpisodeCredits`). */
export const tvEpisodeCreditsSchema = schema<TvEpisodeCredits>(
  _tvEpisodeCreditsSchema
);
