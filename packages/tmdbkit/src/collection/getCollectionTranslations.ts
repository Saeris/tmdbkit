import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { CollectionTranslations } from "./types/CollectionTranslations.js";

export const getCollectionTranslationsSchema = v.object({
  collectionId: tmdbId
});

/**
 * ### [Translations](https://developer.themoviedb.org/reference/collection-translations)
 *
 * **GET** `/collection/{collection_id}/translations`
 */
export const getCollectionTranslations: Fetcher<
  typeof getCollectionTranslationsSchema,
  CollectionTranslations
> = async ({ collectionId }, options) =>
  get(`/collection/${collectionId}/translations`, undefined, options);
