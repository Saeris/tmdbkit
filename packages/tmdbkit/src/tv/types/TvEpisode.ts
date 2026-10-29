import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

/** The episode fields every episode response shares. Episodes embedded in another response also carry `showId`; `getTvEpisode` doesn't. */
export const tvEpisodeEntries = {
  /** `YYYY-MM-DD`, or `null` when unknown. */
  airDate: v.nullable(v.string()),
  episodeNumber: integer,
  /** `standard`, `finale`, `mid_season`, … */
  episodeType: v.string(),
  id: integer,
  name: v.string(),
  overview: v.string(),
  /** `""` when TMDB has none. */
  productionCode: v.string(),
  /** Minutes, or `null` when unknown. */
  runtime: v.nullable(integer),
  seasonNumber: integer,
  stillPath: v.nullable(v.string()),
  voteAverage: v.number(),
  voteCount: integer
} as const;

const _tvEpisodeSummarySchema = v.object({
  ...tvEpisodeEntries,
  showId: integer
});

export interface TvEpisodeSummary extends v.InferOutput<
  typeof _tvEpisodeSummarySchema
> {}

/**
 * ### TV Episode Summary
 *
 * An episode without its credits, as TV series details (`lastEpisodeToAir`, `nextEpisodeToAir`) and episode groups embed it.
 */
export const tvEpisodeSummarySchema = schema<TvEpisodeSummary>(
  _tvEpisodeSummarySchema
);
