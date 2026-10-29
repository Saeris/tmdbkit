import * as v from "valibot";
import { schema } from "../validations/schema.js";
import { integer } from "../validations/integer.js";
import { pagedResults, type PagedResults } from "./PagedResults.js";

const _changedItemSchema = v.object({
  id: integer,
  adult: v.nullable(v.boolean()),
  softcore: v.nullable(v.boolean())
});

export interface ChangedItem extends v.InferOutput<typeof _changedItemSchema> {}

export interface ChangeList extends PagedResults<ChangedItem> {}

/**
 * ### Change List
 *
 * A page of the ids of movies, TV series or people edited in the requested window (`getMovieChangeList`, …). Fetch an id's changes for the details.
 */
export const changeListSchema = schema<ChangeList>(
  pagedResults(schema<ChangedItem>(_changedItemSchema))
);
