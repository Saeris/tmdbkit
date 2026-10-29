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
import { aggregateCreditsSchema } from "./AggregateCredits.js";
import { contentRatingsSchema } from "./ContentRatings.js";
import { episodeGroupsSchema } from "./EpisodeGroups.js";
import { screenedTheatricallySchema } from "./ScreenedTheatrically.js";
import { tvAlternativeTitlesSchema } from "./TvAlternativeTitles.js";
import { tvCreditsSchema } from "./TvCredits.js";
import { tvEpisodeSummarySchema } from "./TvEpisode.js";
import { tvSeriesExternalIdsSchema } from "./TvExternalIds.js";
import { tvKeywordsSchema } from "./TvKeywords.js";
import {
  pagedTvMediaResultsSchema,
  pagedTvResultsSchema
} from "./TvListItem.js";
import { tvTranslationsSchema } from "./TvTranslations.js";

export const tvSeriesDetailsEntries = {
  adult: v.boolean(),
  backdropPath: v.nullable(v.string()),
  createdBy: v.array(
    v.object({
      id: integer,
      creditId: v.string(),
      name: v.string(),
      originalName: v.string(),
      gender: integer,
      profilePath: v.nullable(v.string())
    })
  ),
  /** Typical episode lengths in minutes. TMDB has stopped filling this in: every recorded series returned `[]`. */
  episodeRunTime: v.array(integer),
  /** `YYYY-MM-DD`, or `""` when unknown. */
  firstAirDate: v.string(),
  genres: v.array(genreSchema),
  homepage: v.nullable(v.string()),
  id: integer,
  inProduction: v.boolean(),
  /** ISO 639-1 codes. */
  languages: v.array(v.string()),
  /** `null` is assumed for a series that hasn't aired, not observed. */
  lastAirDate: v.nullable(v.string()),
  /** `null` is assumed for a series that hasn't aired, not observed. */
  lastEpisodeToAir: v.nullable(tvEpisodeSummarySchema),
  name: v.string(),
  /** `null` once a series has no scheduled episode. */
  nextEpisodeToAir: v.nullable(tvEpisodeSummarySchema),
  networks: v.array(productionCompanySchema),
  numberOfEpisodes: integer,
  numberOfSeasons: integer,
  /** ISO 3166-1 codes. */
  originCountry: v.array(v.string()),
  originalLanguage: v.string(),
  originalName: v.string(),
  overview: v.string(),
  popularity: v.number(),
  posterPath: v.nullable(v.string()),
  productionCompanies: v.array(productionCompanySchema),
  productionCountries: v.array(productionCountrySchema),
  /** Season summaries; season `0` holds the specials. Fetch `getTvSeason` for episodes. */
  seasons: v.array(
    v.object({
      airDate: v.nullable(v.string()),
      episodeCount: integer,
      id: integer,
      name: v.string(),
      overview: v.string(),
      posterPath: v.nullable(v.string()),
      seasonNumber: integer,
      voteAverage: v.number()
    })
  ),
  softcore: v.boolean(),
  spokenLanguages: v.array(spokenLanguageSchema),
  /** `Returning Series`, `Ended`, `Canceled`, `In Production`, `Planned` or `Pilot`. */
  status: v.string(),
  tagline: v.string(),
  /** `Scripted`, `Reality`, `Documentary`, `Miniseries`, … */
  type: v.string(),
  voteAverage: v.number(),
  voteCount: integer
} as const;

/** What `appendToResponse` adds: each key holds the matching endpoint's response without its `id` (verified against recorded responses). */
export const tvSeriesAppendedEntries = {
  aggregateCredits: v.exactOptional(omitFields(aggregateCreditsSchema, [`id`])),
  alternativeTitles: v.exactOptional(
    omitFields(tvAlternativeTitlesSchema, [`id`])
  ),
  changes: v.exactOptional(changesSchema),
  contentRatings: v.exactOptional(omitFields(contentRatingsSchema, [`id`])),
  credits: v.exactOptional(omitFields(tvCreditsSchema, [`id`])),
  episodeGroups: v.exactOptional(omitFields(episodeGroupsSchema, [`id`])),
  externalIds: v.exactOptional(omitFields(tvSeriesExternalIdsSchema, [`id`])),
  images: v.exactOptional(omitFields(mediaImagesSchema, [`id`])),
  keywords: v.exactOptional(omitFields(tvKeywordsSchema, [`id`])),
  lists: v.exactOptional(omitFields(listsContainingSchema, [`id`])),
  recommendations: v.exactOptional(pagedTvMediaResultsSchema),
  reviews: v.exactOptional(omitFields(reviewsSchema, [`id`])),
  screenedTheatrically: v.exactOptional(
    omitFields(screenedTheatricallySchema, [`id`])
  ),
  similar: v.exactOptional(pagedTvResultsSchema),
  translations: v.exactOptional(omitFields(tvTranslationsSchema, [`id`])),
  videos: v.exactOptional(omitFields(videosSchema, [`id`])),
  /** The key keeps TMDB's slash: `details["watch/providers"]`. */
  "watch/providers": v.exactOptional(omitFields(watchProvidersSchema, [`id`]))
} as const;

const _tvSeriesDetailsSchema = v.object({
  ...tvSeriesDetailsEntries,
  ...tvSeriesAppendedEntries
});

export interface TvSeriesDetails extends v.InferOutput<
  typeof _tvSeriesDetailsSchema
> {}

/**
 * ### TV Series Details
 *
 * A TV series (`getTvSeries`, `getLatestTvSeries`), plus whatever `appendToResponse` asked for.
 */
export const tvSeriesDetailsSchema = schema<TvSeriesDetails>(
  _tvSeriesDetailsSchema
);
