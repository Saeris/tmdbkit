import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { EpisodeGroupDetails } from "./types/EpisodeGroups.js";

export const getTvEpisodeGroupSchema = v.object({
  tvEpisodeGroupId: v.string()
});

/**
 * ### [Episode Group Details](https://developer.themoviedb.org/reference/tv-episode-group-details)
 *
 * **GET** `/tv/episode_group/{tv_episode_group_id}`
 */
export const getTvEpisodeGroup: Fetcher<
  typeof getTvEpisodeGroupSchema,
  EpisodeGroupDetails
> = async ({ tvEpisodeGroupId }, options) =>
  get(
    `/tv/episode_group/${encodeURIComponent(tvEpisodeGroupId)}`,
    undefined,
    options
  );
