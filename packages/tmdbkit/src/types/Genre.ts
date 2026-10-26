import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const genreEntries = {
  /** the genre id */
  id: v.number(),
  /** the name of the genre */
  name: v.string()
} as const;

const _genreSchema = v.object(genreEntries);

export interface Genre extends v.InferOutput<typeof _genreSchema> {}

/**
 * ### [Genre](https://www.themoviedb.org/documentation/api/genre)
 *
 * A genre that a movie or TV show can be tagged with.
 */
export const genreSchema = schema<Genre>(_genreSchema);
