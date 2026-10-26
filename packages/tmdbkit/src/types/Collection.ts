import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const collectionEntries = {
  /** the collection id */
  id: v.number(),
  /** the name of the collection */
  name: v.string(),
  /** the path of the collection poster */
  posterPath: v.nullish(v.string()),
  /** the path of the collection backdrop */
  backdropPath: v.nullish(v.string())
} as const;

const _collectionSchema = v.object(collectionEntries);

export interface Collection extends v.InferOutput<typeof _collectionSchema> {}

/**
 * ### [Collection](https://www.themoviedb.org/documentation/api/collections)
 *
 * A collection of movies, such as a franchise.
 */
export const collectionSchema = schema<Collection>(_collectionSchema);
