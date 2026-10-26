import * as v from "valibot";
import { schema } from "../../validations/schema.js";

/**
 * A reduced media item (movie or show) used in `known_for` results.
 */
export const knownForEntries = {
  /** whether the media is intended for adults only */
  adult: v.boolean(),
  /** the path of the media backdrop image */
  backdropPath: v.nullish(v.string()),
  /** the media id */
  id: v.number(),
  /** the title of the media */
  title: v.string(),
  /** the original language of the media */
  originalLanguage: v.string(),
  /** the original title of the media */
  originalTitle: v.string(),
  /** the overview of the media */
  overview: v.string(),
  /** the path of the media poster image */
  posterPath: v.nullish(v.string()),
  /** the type of media (movie, tv, or person) */
  mediaType: v.string(),
  /** the genre ids the media is tagged with */
  genreIds: v.array(v.number()),
  /** the popularity of the media */
  popularity: v.number(),
  /** the release date of the media */
  releaseDate: v.nullish(v.string()),
  /** whether the media is a video */
  video: v.boolean(),
  /** the average vote for the media */
  voteAverage: v.number(),
  /** the number of votes for the media */
  voteCount: v.number()
} as const;

const _knownForSchema = v.object(knownForEntries);

export interface KnownFor extends v.InferOutput<typeof _knownForSchema> {}

export const knownForSchema = schema<KnownFor>(_knownForSchema);

export const searchPersonResultEntries = {
  /** whether the person is intended for adults only */
  adult: v.boolean(),
  /** the gender of the person */
  gender: v.number(),
  /** the person id */
  id: v.number(),
  /** the department the person is known for */
  knownForDepartment: v.nullish(v.string()),
  /** the name of the person */
  name: v.string(),
  /** the original name of the person */
  originalName: v.nullish(v.string()),
  /** the popularity of the person */
  popularity: v.number(),
  /** the path of the person profile image */
  profilePath: v.nullish(v.string()),
  /** the media the person is known for */
  knownFor: v.array(knownForSchema)
} as const;

const _searchPersonResultSchema = v.object(searchPersonResultEntries);

export interface SearchPersonResult extends v.InferOutput<
  typeof _searchPersonResultSchema
> {}

/**
 * ### [Search Person](https://www.themoviedb.org/documentation/api/search)
 *
 * A person result from the search endpoint.
 */
export const searchPersonResultSchema = schema<SearchPersonResult>(
  _searchPersonResultSchema
);
