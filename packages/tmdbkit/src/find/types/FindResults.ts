import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { movieMediaListItemSchema } from "../../movie/types/MovieListItem.js";
import { personMediaListItemSchema } from "../../person/types/PersonListItem.js";
import { tvEpisodeEntries } from "../../tv/types/TvEpisode.js";
import { tvMediaListItemSchema } from "../../tv/types/TvListItem.js";

const _findResultsSchema = v.object({
  movieResults: v.array(movieMediaListItemSchema),
  personResults: v.array(personMediaListItemSchema),
  tvResults: v.array(tvMediaListItemSchema),
  tvEpisodeResults: v.array(
    v.object({
      ...tvEpisodeEntries,
      showId: integer,
      mediaType: v.literal(`tv_episode`)
    })
  ),
  tvSeasonResults: v.array(
    v.object({
      id: integer,
      name: v.string(),
      overview: v.string(),
      posterPath: v.nullable(v.string()),
      mediaType: v.literal(`tv_season`),
      voteAverage: v.number(),
      airDate: v.nullable(v.string()),
      seasonNumber: integer,
      showId: integer,
      episodeCount: integer
    })
  )
});

export interface FindResults extends v.InferOutput<typeof _findResultsSchema> {}

/**
 * ### Find Results
 *
 * Whatever TMDB holds for an id from another site (`findByExternalId`), sorted by kind. Usually one array has one entry and the rest are empty: an IMDb id resolves to a movie, series, episode or person, and a TVDB id can also resolve to a season.
 */
export const findResultsSchema = schema<FindResults>(_findResultsSchema);
