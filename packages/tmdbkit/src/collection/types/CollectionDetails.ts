import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { movieMediaListItemSchema } from "../../movie/types/MovieListItem.js";

const _collectionDetailsSchema = v.object({
  id: integer,
  name: v.string(),
  originalLanguage: v.string(),
  originalName: v.string(),
  overview: v.string(),
  posterPath: v.nullable(v.string()),
  backdropPath: v.nullable(v.string()),
  /** The movies in the collection. */
  parts: v.array(movieMediaListItemSchema)
});

export interface CollectionDetails extends v.InferOutput<
  typeof _collectionDetailsSchema
> {}

/**
 * ### Collection
 *
 * A movie collection (a franchise, e.g. "Star Wars Collection") and its movies (`getCollection`). Movies point to theirs through `belongsToCollection`.
 */
export const collectionDetailsSchema = schema<CollectionDetails>(
  _collectionDetailsSchema
);
