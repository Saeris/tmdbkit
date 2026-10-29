import * as v from "valibot";
import { omitFields, schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { changesSchema } from "../../types/Changes.js";
import { genreSchema } from "../../types/Genre.js";
import { mediaImagesSchema } from "../../types/Images.js";
import { productionCompanySchema } from "../../types/ProductionCompany.js";
import { productionCountrySchema } from "../../types/ProductionCountry.js";
import { spokenLanguageSchema } from "../../types/SpokenLanguage.js";
import { videosSchema } from "../../types/Video.js";
import { listsContainingSchema } from "../../list/types/ListsContaining.js";
import { reviewsSchema } from "../../review/types/Review.js";
import { watchProvidersSchema } from "../../watch-providers/types/WatchProviders.js";
import { movieAlternativeTitlesSchema } from "./MovieAlternativeTitles.js";
import { movieCreditsSchema } from "./MovieCredits.js";
import { movieExternalIdsSchema } from "./MovieExternalIds.js";
import { movieKeywordsSchema } from "./MovieKeywords.js";
import {
  pagedMovieMediaResultsSchema,
  pagedMovieResultsSchema
} from "./MovieListItem.js";
import { movieReleaseDatesSchema } from "./MovieReleaseDates.js";
import { movieTranslationsSchema } from "./MovieTranslations.js";

export const movieDetailsEntries = {
  adult: v.boolean(),
  backdropPath: v.nullable(v.string()),
  /** The collection (franchise) the movie is part of; see `getCollection`. */
  belongsToCollection: v.nullable(
    v.object({
      id: integer,
      name: v.string(),
      posterPath: v.nullable(v.string()),
      backdropPath: v.nullable(v.string())
    })
  ),
  /** US dollars; `0` when unknown. */
  budget: integer,
  genres: v.array(genreSchema),
  homepage: v.nullable(v.string()),
  id: integer,
  imdbId: v.nullable(v.string()),
  /** ISO 3166-1 codes. */
  originCountry: v.array(v.string()),
  originalLanguage: v.string(),
  originalTitle: v.string(),
  /** `""` when TMDB has none. */
  overview: v.string(),
  popularity: v.number(),
  posterPath: v.nullable(v.string()),
  productionCompanies: v.array(productionCompanySchema),
  productionCountries: v.array(productionCountrySchema),
  /** `YYYY-MM-DD`, or `""` when unknown. */
  releaseDate: v.string(),
  /** US dollars; `0` when unknown. */
  revenue: integer,
  /** Minutes; `0` when unknown. */
  runtime: v.nullable(integer),
  softcore: v.boolean(),
  spokenLanguages: v.array(spokenLanguageSchema),
  /** `Released`, `Post Production`, `In Production`, `Planned`, `Rumored` or `Canceled`. */
  status: v.string(),
  tagline: v.string(),
  title: v.string(),
  video: v.boolean(),
  voteAverage: v.number(),
  voteCount: integer
} as const;

/** What `appendToResponse` adds: each key holds the matching endpoint's response without its `id` (verified against recorded responses). */
export const movieAppendedEntries = {
  alternativeTitles: v.exactOptional(
    omitFields(movieAlternativeTitlesSchema, [`id`])
  ),
  changes: v.exactOptional(changesSchema),
  credits: v.exactOptional(omitFields(movieCreditsSchema, [`id`])),
  externalIds: v.exactOptional(omitFields(movieExternalIdsSchema, [`id`])),
  images: v.exactOptional(omitFields(mediaImagesSchema, [`id`])),
  keywords: v.exactOptional(omitFields(movieKeywordsSchema, [`id`])),
  lists: v.exactOptional(omitFields(listsContainingSchema, [`id`])),
  recommendations: v.exactOptional(pagedMovieMediaResultsSchema),
  releaseDates: v.exactOptional(omitFields(movieReleaseDatesSchema, [`id`])),
  reviews: v.exactOptional(omitFields(reviewsSchema, [`id`])),
  similar: v.exactOptional(pagedMovieResultsSchema),
  translations: v.exactOptional(omitFields(movieTranslationsSchema, [`id`])),
  videos: v.exactOptional(omitFields(videosSchema, [`id`])),
  /** The key keeps TMDB's slash: `details["watch/providers"]`. */
  "watch/providers": v.exactOptional(omitFields(watchProvidersSchema, [`id`]))
} as const;

const _movieDetailsSchema = v.object({
  ...movieDetailsEntries,
  ...movieAppendedEntries
});

export interface MovieDetails extends v.InferOutput<
  typeof _movieDetailsSchema
> {}

/**
 * ### Movie Details
 *
 * A movie (`getMovie`, `getLatestMovie`), plus whatever `appendToResponse` asked for.
 */
export const movieDetailsSchema = schema<MovieDetails>(_movieDetailsSchema);
