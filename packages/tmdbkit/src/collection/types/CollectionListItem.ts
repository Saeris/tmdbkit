import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { pagedResults, type PagedResults } from "../../types/PagedResults.js";

const _collectionListItemSchema = v.object({
  adult: v.boolean(),
  backdropPath: v.nullable(v.string()),
  id: integer,
  name: v.string(),
  originalLanguage: v.string(),
  originalName: v.string(),
  overview: v.string(),
  posterPath: v.nullable(v.string())
});

export interface CollectionListItem extends v.InferOutput<
  typeof _collectionListItemSchema
> {}

/**
 * ### Collection List Item
 *
 * The summary of a collection that `searchCollections` returns.
 */
export const collectionListItemSchema = schema<CollectionListItem>(
  _collectionListItemSchema
);

export interface PagedCollectionResults extends PagedResults<CollectionListItem> {}

/** A page of {@link CollectionListItem}s. */
export const pagedCollectionResultsSchema = schema<PagedCollectionResults>(
  pagedResults(collectionListItemSchema)
);
