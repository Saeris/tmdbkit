import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { pageEntries } from "../../types/PagedResults.js";

const _listSummarySchema = v.object({
  id: integer,
  name: v.string(),
  /** `""` when the owner wrote none. */
  description: v.string(),
  favoriteCount: integer,
  itemCount: integer,
  iso_639_1: v.string(),
  iso_3166_1: v.string(),
  /** `movie` or `tv`. */
  listType: v.string(),
  posterPath: v.nullable(v.string())
});

export interface ListSummary extends v.InferOutput<typeof _listSummarySchema> {}

const _listsContainingSchema = v.object({
  id: integer,
  ...pageEntries,
  results: v.array(schema<ListSummary>(_listSummarySchema))
});

export interface ListsContaining extends v.InferOutput<
  typeof _listsContainingSchema
> {}

/**
 * ### Lists Containing
 *
 * A page of the user lists a movie or TV series is on (`getMovieLists`, `getTvSeriesLists`).
 */
export const listsContainingSchema = schema<ListsContaining>(
  _listsContainingSchema
);
