import * as v from "valibot";
import { schema, variantSchema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { pagedResults, type PagedResults } from "../../types/PagedResults.js";
import {
  movieMediaListItemSchema,
  type MovieMediaListItem
} from "../../movie/types/MovieListItem.js";
import {
  tvMediaListItemSchema,
  type TvMediaListItem
} from "../../tv/types/TvListItem.js";

export const personListItemEntries = {
  adult: v.boolean(),
  /** TMDB's gender code (`0` when not set). */
  gender: integer,
  id: integer,
  knownForDepartment: v.string(),
  name: v.string(),
  originalName: v.string(),
  popularity: v.number(),
  profilePath: v.nullable(v.string())
} as const;

/** The titles a person is best known for, each tagged with its `mediaType`. */
export const knownFor = v.array(
  variantSchema<MovieMediaListItem | TvMediaListItem>(`mediaType`, [
    movieMediaListItemSchema,
    tvMediaListItemSchema
  ])
);

const _personListItemSchema = v.object({
  ...personListItemEntries,
  knownFor
});

export interface PersonListItem extends v.InferOutput<
  typeof _personListItemSchema
> {}

/**
 * ### Person List Item
 *
 * The summary of a person that `getPopularPeople` and `searchPeople` return, with the titles they're known for. Fetch `getPerson` for the details.
 */
export const personListItemSchema = schema<PersonListItem>(
  _personListItemSchema
);

export const personMediaListItemEntries = {
  ...personListItemEntries,
  mediaType: v.literal(`person`),
  /** Present in `searchMulti` results, absent from `getTrendingPeople`. */
  knownFor: v.exactOptional(knownFor)
} as const;

const _personMediaListItemSchema = v.object(personMediaListItemEntries);

export interface PersonMediaListItem extends v.InferOutput<
  typeof _personMediaListItemSchema
> {}

/** A person tagged with `mediaType: "person"`, as endpoints that can mix media types return them. */
export const personMediaListItemSchema = schema<PersonMediaListItem>(
  _personMediaListItemSchema
);

export interface PagedPersonResults extends PagedResults<PersonListItem> {}

/** A page of {@link PersonListItem}s. */
export const pagedPersonResultsSchema = schema<PagedPersonResults>(
  pagedResults(personListItemSchema)
);

export interface PagedPersonMediaResults extends PagedResults<PersonMediaListItem> {}

/** A page of {@link PersonMediaListItem}s (`getTrendingPeople`). */
export const pagedPersonMediaResultsSchema = schema<PagedPersonMediaResults>(
  pagedResults(personMediaListItemSchema)
);
