import { schema, variantSchema } from "../validations/schema.js";
import { pagedResults, type PagedResults } from "./PagedResults.js";
import {
  movieMediaListItemSchema,
  type MovieMediaListItem
} from "../movie/types/MovieListItem.js";
import {
  tvMediaListItemSchema,
  type TvMediaListItem
} from "../tv/types/TvListItem.js";
import {
  personMediaListItemSchema,
  type PersonMediaListItem
} from "../person/types/PersonListItem.js";

export type MediaListItem =
  | MovieMediaListItem
  | TvMediaListItem
  | PersonMediaListItem;

/**
 * ### Media List Item
 *
 * A movie, TV series or person in a mixed list, told apart by `mediaType` (`searchMulti`, `getTrending`).
 */
export const mediaListItemSchema = variantSchema<MediaListItem>(`mediaType`, [
  movieMediaListItemSchema,
  tvMediaListItemSchema,
  personMediaListItemSchema
]);

export interface PagedMediaResults extends PagedResults<MediaListItem> {}

/** A page of {@link MediaListItem}s. */
export const pagedMediaResultsSchema = schema<PagedMediaResults>(
  pagedResults(mediaListItemSchema)
);
