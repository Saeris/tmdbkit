import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const id = v.nullable(v.string());
const numericId = v.nullable(integer);

const _tvSeriesExternalIdsSchema = v.object({
  id: integer,
  /** `tt…`, or `null` when unknown. */
  imdbId: id,
  freebaseMid: id,
  freebaseId: id,
  /** TheTVDB's series id: the one Plex and Kodi often key TV metadata on. */
  tvdbId: numericId,
  tvrageId: numericId,
  wikidataId: id,
  facebookId: id,
  instagramId: id,
  twitterId: id
});

export interface TvSeriesExternalIds extends v.InferOutput<
  typeof _tvSeriesExternalIdsSchema
> {}

/**
 * ### TV Series External IDs
 *
 * A TV series' ids on other sites (`getTvSeriesExternalIds`). Each is `null` when TMDB doesn't have it.
 */
export const tvSeriesExternalIdsSchema = schema<TvSeriesExternalIds>(
  _tvSeriesExternalIdsSchema
);

const _tvSeasonExternalIdsSchema = v.object({
  id: integer,
  freebaseMid: id,
  freebaseId: id,
  tvdbId: numericId,
  tvrageId: numericId,
  wikidataId: id
});

export interface TvSeasonExternalIds extends v.InferOutput<
  typeof _tvSeasonExternalIdsSchema
> {}

/** A season's ids on other sites (`getTvSeasonExternalIds`). */
export const tvSeasonExternalIdsSchema = schema<TvSeasonExternalIds>(
  _tvSeasonExternalIdsSchema
);

const _tvEpisodeExternalIdsSchema = v.object({
  id: integer,
  imdbId: id,
  freebaseMid: id,
  freebaseId: id,
  tvdbId: numericId,
  tvrageId: numericId,
  wikidataId: id
});

export interface TvEpisodeExternalIds extends v.InferOutput<
  typeof _tvEpisodeExternalIdsSchema
> {}

/** An episode's ids on other sites (`getTvEpisodeExternalIds`). */
export const tvEpisodeExternalIdsSchema = schema<TvEpisodeExternalIds>(
  _tvEpisodeExternalIdsSchema
);
