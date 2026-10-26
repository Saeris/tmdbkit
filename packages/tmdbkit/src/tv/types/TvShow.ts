import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { genreSchema } from "../../types/Genre.js";
import { networkSchema } from "../../types/Network.js";
import { productionCompanySchema } from "../../types/ProductionCompany.js";
import { productionCountrySchema } from "../../types/ProductionCountry.js";
import { seasonSchema } from "../../types/Season.js";
import { spokenLanguageSchema } from "../../types/SpokenLanguage.js";

const creatorSchema = v.object({
  /** the person id */
  id: v.number(),
  /** the credit id */
  creditId: v.nullish(v.string()),
  /** the name of the creator */
  name: v.string(),
  /** the gender of the creator */
  gender: v.number(),
  /** the path of the creator profile image */
  profilePath: v.nullish(v.string())
});

/**
 * A reference to an episode (used for `last_episode_to_air` and `next_episode_to_air`).
 */
const seasonEpisodeRefSchema = v.object({
  /** the episode id */
  id: v.number(),
  /** the name of the episode */
  name: v.string(),
  /** the overview of the episode */
  overview: v.string(),
  /** the average vote for the episode */
  voteAverage: v.number(),
  /** the number of votes for the episode */
  voteCount: v.number(),
  /** the date the episode first aired */
  airDate: v.nullish(v.string()),
  /** the episode number within the season */
  episodeNumber: v.number(),
  /** the production code of the episode */
  productionCode: v.nullish(v.string()),
  /** the runtime of the episode in minutes */
  runtime: v.nullish(v.number()),
  /** the season number the episode belongs to */
  seasonNumber: v.number(),
  /** the id of the show the episode belongs to */
  showId: v.number(),
  /** the path of the episode still image */
  stillPath: v.nullish(v.string())
});

export const tvShowEntries = {
  /** whether the show is intended for adults only */
  adult: v.boolean(),
  /** the path of the show backdrop image */
  backdropPath: v.nullish(v.string()),
  /** the creators of the show */
  createdBy: v.array(creatorSchema),
  /** the runtime of the show's episodes in minutes */
  episodeRunTime: v.array(v.number()),
  /** the date the show first aired */
  firstAirDate: v.nullish(v.string()),
  /** the genres the show is tagged with */
  genres: v.array(genreSchema),
  /** the homepage of the show */
  homepage: v.nullish(v.string()),
  /** the show id */
  id: v.number(),
  /** whether the show is currently in production */
  inProduction: v.boolean(),
  /** the ISO 639-1 codes for the languages the show is available in */
  languages: v.array(v.string()),
  /** the date the show last aired */
  lastAirDate: v.nullish(v.string()),
  /** the last episode to air */
  lastEpisodeToAir: v.nullable(seasonEpisodeRefSchema),
  /** the name of the show */
  name: v.string(),
  /** the next episode to air */
  nextEpisodeToAir: v.nullable(seasonEpisodeRefSchema),
  /** the networks that broadcast the show */
  networks: v.array(networkSchema),
  /** the total number of episodes in the show */
  numberOfEpisodes: v.number(),
  /** the total number of seasons in the show */
  numberOfSeasons: v.number(),
  /** the ISO 3166-1 codes for the countries the show was produced in */
  originCountry: v.array(v.string()),
  /** the original language of the show */
  originalLanguage: v.string(),
  /** the original name of the show */
  originalName: v.string(),
  /** the overview of the show */
  overview: v.string(),
  /** the popularity of the show */
  popularity: v.number(),
  /** the path of the show poster image */
  posterPath: v.nullish(v.string()),
  /** the production companies that produced the show */
  productionCompanies: v.array(productionCompanySchema),
  /** the countries where the show was produced */
  productionCountries: v.array(productionCountrySchema),
  /** the seasons of the show */
  seasons: v.array(seasonSchema),
  /** the languages spoken in the show */
  spokenLanguages: v.array(spokenLanguageSchema),
  /** the certification status of the show */
  status: v.string(),
  /** the tagline of the show */
  tagline: v.nullish(v.string()),
  /** the type of the show */
  type: v.nullish(v.string()),
  /** the average vote for the show */
  voteAverage: v.number(),
  /** the number of votes for the show */
  voteCount: v.number()
} as const;

const _tvShowSchema = v.object(tvShowEntries);

export interface TvShow extends v.InferOutput<typeof _tvShowSchema> {}

/**
 * ### [TV Show](https://www.themoviedb.org/documentation/api/tv)
 *
 * A TV show with full detail.
 */
export const tvShowSchema = schema<TvShow>(_tvShowSchema);
