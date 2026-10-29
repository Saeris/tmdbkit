import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { MediaImages } from "../types/Images.js";

export const getCollectionImagesSchema = v.object({
  collectionId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        /** Specify a comma separated list of ISO-639-1 values to query, for example: `en-US,null` */
        includeImageLanguage: v.string(),
        language: v.string()
      })
    )
  )
});

/**
 * ### [Images](https://developer.themoviedb.org/reference/collection-images)
 *
 * **GET** `/collection/{collection_id}/images`
 */
export const getCollectionImages: Fetcher<
  typeof getCollectionImagesSchema,
  MediaImages
> = async ({ collectionId, params }, options) =>
  get(`/collection/${collectionId}/images`, params, options);
