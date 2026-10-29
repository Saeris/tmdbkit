import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { FindResults } from "./types/FindResults.js";

export const findByExternalIdSchema = v.object({
  externalId: v.string(),
  externalSource: v.picklist([
    "imdb_id",
    "facebook_id",
    "instagram_id",
    "tvdb_id",
    "tiktok_id",
    "twitter_id",
    "wikidata_id",
    "youtube_id"
  ]),
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Find By ID](https://developer.themoviedb.org/reference/find-by-id)
 *
 * **GET** `/find/{external_id}`
 */
export const findByExternalId: Fetcher<
  typeof findByExternalIdSchema,
  FindResults
> = async ({ externalId, externalSource, params }, options) =>
  get(
    `/find/${encodeURIComponent(externalId)}`,
    { ...params, externalSource },
    options
  );
