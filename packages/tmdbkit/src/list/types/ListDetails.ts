import * as v from "valibot";
import { schema, variantSchema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { pageEntries } from "../../types/PagedResults.js";
import {
  movieMediaListItemSchema,
  type MovieMediaListItem
} from "../../movie/types/MovieListItem.js";
import {
  tvMediaListItemSchema,
  type TvMediaListItem
} from "../../tv/types/TvListItem.js";

const _listDetailsSchema = v.object({
  ...pageEntries,
  id: integer,
  name: v.string(),
  description: v.string(),
  /** The username of the list's owner. */
  createdBy: v.string(),
  favoriteCount: integer,
  itemCount: integer,
  iso_639_1: v.string(),
  /** The movies and TV series on this page of the list. */
  items: v.array(
    variantSchema<MovieMediaListItem | TvMediaListItem>(`mediaType`, [
      movieMediaListItemSchema,
      tvMediaListItemSchema
    ])
  ),
  /** TMDB returned a number here for a list without a poster (2026-10-28), so both are accepted. */
  posterPath: v.nullable(v.union([v.string(), v.number()]))
});

export interface ListDetails extends v.InferOutput<typeof _listDetailsSchema> {}

/**
 * ### List
 *
 * A user-made list of movies and TV series, one page of items at a time (`getList`).
 */
export const listDetailsSchema = schema<ListDetails>(_listDetailsSchema);
