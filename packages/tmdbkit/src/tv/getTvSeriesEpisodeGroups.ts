import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { EpisodeGroups } from "./types/EpisodeGroups.js";

export const getTvSeriesEpisodeGroupsSchema = v.object({
  seriesId: tmdbId
});

/**
 * ### [Episode Groups](https://developer.themoviedb.org/reference/tv-series-episode-groups)
 *
 * **GET** `/tv/{series_id}/episode_groups`
 */
export const getTvSeriesEpisodeGroups: Fetcher<
  typeof getTvSeriesEpisodeGroupsSchema,
  EpisodeGroups
> = async ({ seriesId }, options) =>
  get(`/tv/${seriesId}/episode_groups`, undefined, options);
