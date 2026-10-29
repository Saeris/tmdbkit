import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { productionCompanySchema } from "../../types/ProductionCompany.js";
import { tvEpisodeEntries } from "./TvEpisode.js";

/** The fields an episode group has both in a series' list and on its own. */
const episodeGroupEntries = {
  id: v.string(),
  name: v.string(),
  /** `""` when the group has none. */
  description: v.string(),
  episodeCount: integer,
  groupCount: integer,
  /** The kind of ordering, as an integer code. TMDB doesn't document the codes (its example uses `1` for an "Aired Order" group). */
  type: integer
} as const;

const _episodeGroupsSchema = v.object({
  id: integer,
  results: v.array(
    v.object({
      ...episodeGroupEntries,
      network: v.nullable(productionCompanySchema)
    })
  )
});

export interface EpisodeGroups extends v.InferOutput<
  typeof _episodeGroupsSchema
> {}

/**
 * ### Episode Groups
 *
 * The alternative orderings of a TV series' episodes (DVD order, story arcs, …) that TMDB users have built (`getTvSeriesEpisodeGroups`).
 */
export const episodeGroupsSchema = schema<EpisodeGroups>(_episodeGroupsSchema);

const _episodeGroupDetailsSchema = v.object({
  ...episodeGroupEntries,
  /** In the series' list this is the network object; here TMDB returned only its id (2026-10-28). Both are accepted. */
  network: v.nullable(v.union([integer, productionCompanySchema])),
  groups: v.array(
    v.object({
      id: v.string(),
      name: v.string(),
      order: integer,
      locked: v.boolean(),
      episodes: v.array(
        v.object({
          ...tvEpisodeEntries,
          showId: integer,
          /** The episode's position within the group. */
          order: integer
        })
      )
    })
  )
});

export interface EpisodeGroupDetails extends v.InferOutput<
  typeof _episodeGroupDetailsSchema
> {}

/** One episode group with its groups and their episodes (`getTvEpisodeGroup`). */
export const episodeGroupDetailsSchema = schema<EpisodeGroupDetails>(
  _episodeGroupDetailsSchema
);
