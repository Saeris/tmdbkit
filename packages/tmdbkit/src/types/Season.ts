import * as v from "valibot";
import { schema } from "../validations/schema.js";
import { episodeSchema } from "./Episode.js";
import { networkSchema } from "./Network.js";

export const seasonEntries = {
  /** the date the season first aired */
  airDate: v.nullish(v.string()),
  /** the number of episodes in the season */
  episodeCount: v.number(),
  /** the season id */
  id: v.number(),
  /** the name of the season */
  name: v.string(),
  /** the overview of the season */
  overview: v.string(),
  /** the path of the season poster image */
  posterPath: v.nullish(v.string()),
  /** the season number */
  seasonNumber: v.number(),
  /** the average vote for the season */
  voteAverage: v.number(),
  /** the episodes in the season (present in the season detail response) */
  episodes: v.exactOptional(v.array(episodeSchema)),
  /** the networks that broadcast the season (present in the season detail response) */
  networks: v.exactOptional(v.array(networkSchema))
} as const;

const _seasonSchema = v.object(seasonEntries);

export interface Season extends v.InferOutput<typeof _seasonSchema> {}

/**
 * ### [Season](https://www.themoviedb.org/documentation/api/tv)
 *
 * A season of a TV show.
 */
export const seasonSchema = schema<Season>(_seasonSchema);
