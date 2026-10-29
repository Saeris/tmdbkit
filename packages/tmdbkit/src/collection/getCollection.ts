import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { CollectionDetails } from "./types/CollectionDetails.js";

export const getCollectionSchema = v.object({
  collectionId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/collection-details)
 *
 * **GET** `/collection/{collection_id}`
 */
export const getCollection: Fetcher<
  typeof getCollectionSchema,
  CollectionDetails
> = async ({ collectionId, params }, options) =>
  get(`/collection/${collectionId}`, params, options);
