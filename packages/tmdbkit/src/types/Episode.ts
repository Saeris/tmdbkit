import * as v from "valibot";
import { schema } from "../validations/schema.js";
import { crewMemberSchema } from "./CrewMember.js";
import { guestStarSchema } from "./GuestStar.js";

export const episodeEntries = {
  /** the date the episode first aired */
  airDate: v.nullish(v.string()),
  /** the episode number within the season */
  episodeNumber: v.number(),
  /** the type of episode */
  episodeType: v.nullish(v.string()),
  /** the episode id */
  id: v.number(),
  /** the name of the episode */
  name: v.string(),
  /** the overview of the episode */
  overview: v.string(),
  /** the production code of the episode */
  productionCode: v.nullish(v.string()),
  /** the runtime of the episode in minutes */
  runtime: v.nullish(v.number()),
  /** the season number the episode belongs to */
  seasonNumber: v.number(),
  /** the id of the show the episode belongs to */
  showId: v.number(),
  /** the path of the episode still image */
  stillPath: v.nullish(v.string()),
  /** the average vote for the episode */
  voteAverage: v.number(),
  /** the number of votes for the episode */
  voteCount: v.number(),
  /** the crew for the episode (when requested via append_to_response) */
  crew: v.exactOptional(v.array(crewMemberSchema)),
  /** the guest stars for the episode (when requested via append_to_response) */
  guestStars: v.exactOptional(v.array(guestStarSchema))
} as const;

const _episodeSchema = v.object(episodeEntries);

export interface Episode extends v.InferOutput<typeof _episodeSchema> {}

/**
 * ### [Episode](https://www.themoviedb.org/documentation/api/tv)
 *
 * An episode of a TV show.
 */
export const episodeSchema = schema<Episode>(_episodeSchema);
