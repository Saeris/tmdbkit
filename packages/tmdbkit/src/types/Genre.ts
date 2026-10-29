import * as v from "valibot";
import { schema } from "../validations/schema.js";
import { integer } from "../validations/integer.js";

export const genreEntries = {
  id: integer,
  name: v.string()
} as const;

const _genreSchema = v.object(genreEntries);

export interface Genre extends v.InferOutput<typeof _genreSchema> {}

/**
 * ### Genre
 *
 * A genre a movie or TV series is tagged with. Ids are stable; names follow the request's `language`.
 */
export const genreSchema = schema<Genre>(_genreSchema);
