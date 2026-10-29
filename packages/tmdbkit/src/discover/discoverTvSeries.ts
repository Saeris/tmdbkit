import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import { isoDate } from "../validations/isoDate.js";
import type { PagedTvResults } from "../tv/types/TvListItem.js";

export const discoverTvSeriesSchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        firstAirDateYear: integer,
        includeAdult: v.boolean(),
        includeNullFirstAirDates: v.boolean(),
        language: v.string(),
        page: integer,
        screenedTheatrically: v.boolean(),
        sortBy: v.picklist([
          "first_air_date.asc",
          "first_air_date.desc",
          "name.asc",
          "name.desc",
          "original_name.asc",
          "original_name.desc",
          "popularity.asc",
          "popularity.desc",
          "vote_average.asc",
          "vote_average.desc",
          "vote_count.asc",
          "vote_count.desc"
        ]),
        timezone: v.string(),
        /** Use in conjunction with `with_watch_monetization_types ` or `with_watch_providers ` */
        watchRegion: v.string(),
        /** Can be a comma (`AND`) or pipe (`OR`) separated query */
        withCompanies: v.union([
          v.string(),
          v.array(v.union([integer, v.string()]))
        ]),
        /** Can be a comma (`AND`) or pipe (`OR`) separated query */
        withGenres: v.union([
          v.string(),
          v.array(v.union([integer, v.string()]))
        ]),
        /** Can be a comma (`AND`) or pipe (`OR`) separated query */
        withKeywords: v.union([
          v.string(),
          v.array(v.union([integer, v.string()]))
        ]),
        withNetworks: integer,
        withOriginCountry: v.string(),
        withOriginalLanguage: v.string(),
        /** Possible values are: [0, 1, 2, 3, 4, 5], can be a comma (`AND`) or pipe (`OR`) separated query */
        withStatus: v.union([v.string(), v.array(v.string())]),
        /** Possible values are: [flatrate, free, ads, rent, buy] use in conjunction with `watch_region`, can be a comma (`AND`) or pipe (`OR`) separated query */
        withWatchMonetizationTypes: v.union([v.string(), v.array(v.string())]),
        /** Use in conjunction with `watch_region`, can be a comma (`AND`) or pipe (`OR`) separated query */
        withWatchProviders: v.union([
          v.string(),
          v.array(v.union([integer, v.string()]))
        ]),
        withoutCompanies: v.string(),
        withoutGenres: v.string(),
        withoutKeywords: v.string(),
        withoutWatchProviders: v.string(),
        /** Possible values are: [0, 1, 2, 3, 4, 5, 6], can be a comma (`AND`) or pipe (`OR`) separated query */
        withType: v.union([v.string(), v.array(v.string())]),
        airDate: v.partial(
          v.object({
            gte: isoDate,
            lte: isoDate
          })
        ),
        firstAirDate: v.partial(
          v.object({
            gte: isoDate,
            lte: isoDate
          })
        ),
        voteAverage: v.partial(
          v.object({
            gte: v.number(),
            lte: v.number()
          })
        ),
        voteCount: v.partial(
          v.object({
            gte: v.number(),
            lte: v.number()
          })
        ),
        withRuntime: v.partial(
          v.object({
            gte: integer,
            lte: integer
          })
        )
      })
    )
  )
});

/**
 * ### [TV](https://developer.themoviedb.org/reference/discover-tv)
 *
 * **GET** `/discover/tv`
 */
export const discoverTvSeries: Fetcher<
  typeof discoverTvSeriesSchema,
  PagedTvResults
> = async ({ params }, options) => get(`/discover/tv`, params, options);
