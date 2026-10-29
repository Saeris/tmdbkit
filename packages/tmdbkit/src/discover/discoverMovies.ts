import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import { isoDate } from "../validations/isoDate.js";
import { releaseType } from "../movie/types/MovieReleaseDates.js";
import type { PagedMovieResults } from "../movie/types/MovieListItem.js";

export const discoverMoviesSchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        /** Use in conjunction with `region` */
        certification: v.union([
          v.string(),
          v.partial(v.object({ gte: v.string(), lte: v.string() }))
        ]),
        /** Use in conjunction with the `certification`, `certification.gte` and `certification.lte` filters */
        certificationCountry: v.string(),
        includeAdult: v.boolean(),
        includeVideo: v.boolean(),
        language: v.string(),
        page: integer,
        primaryReleaseYear: integer,
        region: v.string(),
        sortBy: v.picklist([
          "original_title.asc",
          "original_title.desc",
          "popularity.asc",
          "popularity.desc",
          "revenue.asc",
          "revenue.desc",
          "primary_release_date.asc",
          "title.asc",
          "title.desc",
          "primary_release_date.desc",
          "vote_average.asc",
          "vote_average.desc",
          "vote_count.asc",
          "vote_count.desc"
        ]),
        /** Use in conjunction with `with_watch_monetization_types ` or `with_watch_providers ` */
        watchRegion: v.string(),
        /** Can be a comma (`AND`) or pipe (`OR`) separated query */
        withCast: v.union([
          v.string(),
          v.array(v.union([integer, v.string()]))
        ]),
        /** Can be a comma (`AND`) or pipe (`OR`) separated query */
        withCompanies: v.union([
          v.string(),
          v.array(v.union([integer, v.string()]))
        ]),
        /** Can be a comma (`AND`) or pipe (`OR`) separated query */
        withCrew: v.union([
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
        withOriginCountry: v.string(),
        withOriginalLanguage: v.string(),
        /** Can be a comma (`AND`) or pipe (`OR`) separated query */
        withPeople: v.union([
          v.string(),
          v.array(v.union([integer, v.string()]))
        ]),
        /** Possible values are: [1, 2, 3, 4, 5, 6] can be a comma (`AND`) or pipe (`OR`) separated query, can be used in conjunction with `region` */
        withReleaseType: v.union([v.string(), v.array(releaseType)]),
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
        year: integer,
        primaryReleaseDate: v.partial(
          v.object({
            gte: isoDate,
            lte: isoDate
          })
        ),
        releaseDate: v.partial(
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
 * ### [Movie](https://developer.themoviedb.org/reference/discover-movie)
 *
 * **GET** `/discover/movie`
 */
export const discoverMovies: Fetcher<
  typeof discoverMoviesSchema,
  PagedMovieResults
> = async ({ params }, options) => get(`/discover/movie`, params, options);
