import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { collectionSchema } from "../../types/Collection.js";
import { genreSchema } from "../../types/Genre.js";
import { productionCompanySchema } from "../../types/ProductionCompany.js";
import { productionCountrySchema } from "../../types/ProductionCountry.js";
import { spokenLanguageSchema } from "../../types/SpokenLanguage.js";

export const movieEntries = {
  /** whether the movie is intended for adults only */
  adult: v.boolean(),
  /** the path of the movie backdrop image */
  backdropPath: v.nullish(v.string()),
  /** the collection the movie belongs to, if any */
  belongsToCollection: v.nullable(collectionSchema),
  /** the budget of the movie */
  budget: v.number(),
  /** the genres the movie is tagged with */
  genres: v.array(genreSchema),
  /** the homepage of the movie */
  homepage: v.nullish(v.string()),
  /** the movie id */
  id: v.number(),
  /** the IMDB id for the movie */
  imdbId: v.nullish(v.string()),
  /** the ISO 3166-1 codes for the countries the movie was produced in */
  originCountry: v.array(v.string()),
  /** the original language of the movie */
  originalLanguage: v.string(),
  /** the original title of the movie */
  originalTitle: v.string(),
  /** the overview of the movie */
  overview: v.string(),
  /** the popularity of the movie */
  popularity: v.number(),
  /** the path of the movie poster image */
  posterPath: v.nullish(v.string()),
  /** the production companies that produced the movie */
  productionCompanies: v.array(productionCompanySchema),
  /** the countries where the movie was produced */
  productionCountries: v.array(productionCountrySchema),
  /** the release date of the movie */
  releaseDate: v.nullish(v.string()),
  /** the revenue of the movie */
  revenue: v.number(),
  /** the runtime of the movie in minutes */
  runtime: v.nullish(v.number()),
  /** the languages spoken in the movie */
  spokenLanguages: v.array(spokenLanguageSchema),
  /** the certification status of the movie */
  status: v.string(),
  /** the tagline of the movie */
  tagline: v.nullish(v.string()),
  /** the title of the movie */
  title: v.string(),
  /** whether the movie is a video */
  video: v.boolean(),
  /** the average vote for the movie */
  voteAverage: v.number(),
  /** the number of votes for the movie */
  voteCount: v.number()
} as const;

const _movieSchema = v.object(movieEntries);

export interface Movie extends v.InferOutput<typeof _movieSchema> {}

/**
 * ### [Movie](https://www.themoviedb.org/documentation/api/movies)
 *
 * A movie with full detail.
 */
export const movieSchema = schema<Movie>(_movieSchema);
