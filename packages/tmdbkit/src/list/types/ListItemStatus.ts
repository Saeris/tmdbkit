import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _listItemStatusSchema = v.object({
  /** The list id. TMDB returned it as a string (2026-10-28), unlike the number `getList` uses, so both are accepted. */
  id: v.union([v.string(), integer]),
  itemPresent: v.boolean()
});

export interface ListItemStatus extends v.InferOutput<
  typeof _listItemStatusSchema
> {}

/**
 * ### List Item Status
 *
 * Whether a movie is on a list (`getListItemStatus`).
 */
export const listItemStatusSchema = schema<ListItemStatus>(
  _listItemStatusSchema
);
