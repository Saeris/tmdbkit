<div align="center">

# 🎬 tmdbkit

[![npm version][npm_badge]][npm]
[![CI status][ci_badge]][ci]

A type-safe client for [The Movie Database (TMDB)][tmdb] API, with [Valibot][valibot] schemas checked against TMDB's real responses

</div>

---

## 📦 Installation

```bash
npm install @saeris/tmdbkit valibot
```

```bash
yarn add @saeris/tmdbkit valibot
```

> [!NOTE]
>
> `valibot >= 1.4.0` is a peer dependency. tmdbkit runs anywhere with `fetch` and `URL`: Node 22+, browsers, webviews and workers.

## 🔑 Authentication

Get an **API Read Access Token** (preferred) or a **v3 API key** from your [TMDB API settings][tmdb_api_settings]. Both give the same access. Set one in the environment, or on the shared `tmdb` session:

```ts
import { tmdb } from "@saeris/tmdbkit";

tmdb.setToken(`<API Read Access Token>`); // sent as `Authorization: Bearer …`
// or
tmdb.setApiKey(`<v3 API key>`); // sent as `?api_key=…`
```

With nothing set, tmdbkit reads `TMDB_API_TOKEN`, then `TMDB_API_KEY`, from the environment. An explicit credential wins over the environment, and a token wins over a key.

## 🔧 Usage

Every endpoint is a function that takes its path params and a `params` object of query params, and resolves to a typed response:

```ts
import { getMovie, imageUrl, searchMovies } from "@saeris/tmdbkit";

const { results } = await searchMovies({
  query: `Star Wars`,
  params: { year: 1977 }
});

const movie = await getMovie({
  movieId: results[0].id,
  // Fetch related resources in the same request; each comes back under its own key.
  params: { appendToResponse: [`credits`, `release_dates`] }
});

movie.credits?.cast[0].character; // "Luke Skywalker"
imageUrl(movie.posterPath, `w500`); // "https://image.tmdb.org/t/p/w500/….jpg", or null with no poster
```

### With runtime validation

Every endpoint exports its input schema (`getMovieSchema`) and its response schema (`movieDetailsSchema`). `toValidated` wraps an endpoint so both are checked at runtime: useful wherever input comes from outside your app, or wherever you want a change in TMDB's responses to fail loudly at the boundary.

```ts
import {
  getMovie,
  getMovieSchema,
  movieDetailsSchema,
  toValidated
} from "@saeris/tmdbkit";

const getMovieSafe = toValidated(getMovie, getMovieSchema, movieDetailsSchema);

// Throws if the input doesn't match getMovieSchema,
// or the response doesn't match movieDetailsSchema.
const movie = await getMovieSafe({ movieId: 11 });
```

### Errors

A non-2xx response throws a `TmdbApiError` carrying the HTTP `status` plus TMDB's own `statusCode` and `statusMessage`:

```ts
import { getMovie, TmdbApiError } from "@saeris/tmdbkit";

try {
  await getMovie({ movieId: 999999999 });
} catch (error) {
  if (error instanceof TmdbApiError && error.statusCode === 34) {
    // 34: "The resource you requested could not be found."
  }
}
```

Error messages name the method and path but never the query string, so a v3 `api_key` doesn't leak into logs.

### Cancellation

Every endpoint takes `{ signal }` as its last argument. Aborting rejects the request with an `AbortError` while it waits for a rate-limit slot, while it is in flight, or while it backs off before a retry.

```ts
const controller = new AbortController();
const pending = getMovie({ movieId: 11 }, { signal: controller.signal });
controller.abort();
```

### Configuration

The shared `tmdb` session holds the credentials and these settings:

| setting                    | default         | purpose                                                                                                                                                                                                 |
| -------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tmdb.setRateLimit(limit)` | 20 req / 1000ms | Client-side limit, `{ requests, perMs }`. TMDB's ceiling is "around 40 requests per second" ([rate limiting][tmdb_rate_limiting]), so the default leaves headroom. Requests run concurrently within it. |
| `tmdb.maxRetries`          | `3`             | Retries after the first attempt, for `429`, `500`, `502`, `503`, `504` and network failures. Client errors are never retried.                                                                           |
| `tmdb.retryDelay`          | `500`           | Base backoff in ms (`retryDelay * 2^attempt`), used when TMDB sends no `Retry-After`.                                                                                                                   |
| `tmdb.clearSession()`      |                 | Forget the credentials and restore the default rate limit.                                                                                                                                              |
| `tmdb.getQueueSize()`      |                 | How many requests are waiting for a rate-limit slot.                                                                                                                                                    |

### Response shapes

- **Keys are camelCased** (`poster_path` → `posterPath`), with two deliberate exceptions: ISO-code keys keep TMDB's names (`iso_3166_1`, `iso_639_1`), and leading-underscore keys stay as they are (`_id`).
- **TMDB marks "unknown" per field**, not by one rule: an unknown `releaseDate` or `overview` is `""`, while an unknown `airDate`, `birthday` or `imdbId` is `null`. The schemas follow what TMDB actually returns, and their JSDoc says which a field uses.
- **Appended keys** (`appendToResponse`) are optional keys on the details response, each holding that endpoint's response without its `id`. The watch-providers key keeps TMDB's slash: `movie["watch/providers"]`.
- **Images** come back as paths (`/abc.jpg`); `imageUrl(path, size)` builds the URL. Sizes per kind of image are in `imageSizes`.

## API Coverage

Every read endpoint of TMDB's v3 API is implemented. Each one's spec checks the request it sends and that every recorded TMDB response passes its schema.

<!-- coverage:start -->

<!-- Generated by `node scripts/codegen/coverage.ts`; edit operations.ts, not this table. -->

#### Configuration

| Operation                                                                                                 | Endpoint                                  |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [`getConfiguration`](https://developer.themoviedb.org/reference/configuration-details)                    | `GET /configuration`                      |
| [`getCountries`](https://developer.themoviedb.org/reference/configuration-countries)                      | `GET /configuration/countries`            |
| [`getJobs`](https://developer.themoviedb.org/reference/configuration-jobs)                                | `GET /configuration/jobs`                 |
| [`getLanguages`](https://developer.themoviedb.org/reference/configuration-languages)                      | `GET /configuration/languages`            |
| [`getPrimaryTranslations`](https://developer.themoviedb.org/reference/configuration-primary-translations) | `GET /configuration/primary_translations` |
| [`getTimezones`](https://developer.themoviedb.org/reference/configuration-timezones)                      | `GET /configuration/timezones`            |

#### Certifications

| Operation                                                                                       | Endpoint                        |
| ----------------------------------------------------------------------------------------------- | ------------------------------- |
| [`getMovieCertifications`](https://developer.themoviedb.org/reference/certification-movie-list) | `GET /certification/movie/list` |
| [`getTvCertifications`](https://developer.themoviedb.org/reference/certifications-tv-list)      | `GET /certification/tv/list`    |

#### Genres

| Operation                                                                       | Endpoint                |
| ------------------------------------------------------------------------------- | ----------------------- |
| [`getMovieGenres`](https://developer.themoviedb.org/reference/genre-movie-list) | `GET /genre/movie/list` |
| [`getTvGenres`](https://developer.themoviedb.org/reference/genre-tv-list)       | `GET /genre/tv/list`    |

#### Watch Providers

| Operation                                                                                                 | Endpoint                       |
| --------------------------------------------------------------------------------------------------------- | ------------------------------ |
| [`getWatchProviderRegions`](https://developer.themoviedb.org/reference/watch-providers-available-regions) | `GET /watch/providers/regions` |
| [`getMovieWatchProviderList`](https://developer.themoviedb.org/reference/watch-providers-movie-list)      | `GET /watch/providers/movie`   |
| [`getTvWatchProviderList`](https://developer.themoviedb.org/reference/watch-provider-tv-list)             | `GET /watch/providers/tv`      |

#### Movies

| Operation                                                                                          | Endpoint                                   |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [`getMovie`](https://developer.themoviedb.org/reference/movie-details)                             | `GET /movie/{movie_id}`                    |
| [`getMovieAlternativeTitles`](https://developer.themoviedb.org/reference/movie-alternative-titles) | `GET /movie/{movie_id}/alternative_titles` |
| [`getMovieChanges`](https://developer.themoviedb.org/reference/movie-changes)                      | `GET /movie/{movie_id}/changes`            |
| [`getMovieCredits`](https://developer.themoviedb.org/reference/movie-credits)                      | `GET /movie/{movie_id}/credits`            |
| [`getMovieExternalIds`](https://developer.themoviedb.org/reference/movie-external-ids)             | `GET /movie/{movie_id}/external_ids`       |
| [`getMovieImages`](https://developer.themoviedb.org/reference/movie-images)                        | `GET /movie/{movie_id}/images`             |
| [`getMovieKeywords`](https://developer.themoviedb.org/reference/movie-keywords)                    | `GET /movie/{movie_id}/keywords`           |
| [`getLatestMovie`](https://developer.themoviedb.org/reference/movie-latest-id)                     | `GET /movie/latest`                        |
| [`getMovieLists`](https://developer.themoviedb.org/reference/movie-lists)                          | `GET /movie/{movie_id}/lists`              |
| [`getMovieRecommendations`](https://developer.themoviedb.org/reference/movie-recommendations)      | `GET /movie/{movie_id}/recommendations`    |
| [`getMovieReleaseDates`](https://developer.themoviedb.org/reference/movie-release-dates)           | `GET /movie/{movie_id}/release_dates`      |
| [`getMovieReviews`](https://developer.themoviedb.org/reference/movie-reviews)                      | `GET /movie/{movie_id}/reviews`            |
| [`getSimilarMovies`](https://developer.themoviedb.org/reference/movie-similar)                     | `GET /movie/{movie_id}/similar`            |
| [`getMovieTranslations`](https://developer.themoviedb.org/reference/movie-translations)            | `GET /movie/{movie_id}/translations`       |
| [`getMovieVideos`](https://developer.themoviedb.org/reference/movie-videos)                        | `GET /movie/{movie_id}/videos`             |
| [`getMovieWatchProviders`](https://developer.themoviedb.org/reference/movie-watch-providers)       | `GET /movie/{movie_id}/watch/providers`    |
| [`getNowPlayingMovies`](https://developer.themoviedb.org/reference/movie-now-playing-list)         | `GET /movie/now_playing`                   |
| [`getPopularMovies`](https://developer.themoviedb.org/reference/movie-popular-list)                | `GET /movie/popular`                       |
| [`getTopRatedMovies`](https://developer.themoviedb.org/reference/movie-top-rated-list)             | `GET /movie/top_rated`                     |
| [`getUpcomingMovies`](https://developer.themoviedb.org/reference/movie-upcoming-list)              | `GET /movie/upcoming`                      |
| [`getMovieChangeList`](https://developer.themoviedb.org/reference/changes-movie-list)              | `GET /movie/changes`                       |

#### TV Series, Seasons & Episodes

| Operation                                                                                                       | Endpoint                                                                           |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`getTvSeries`](https://developer.themoviedb.org/reference/tv-series-details)                                   | `GET /tv/{series_id}`                                                              |
| [`getTvSeriesAggregateCredits`](https://developer.themoviedb.org/reference/tv-series-aggregate-credits)         | `GET /tv/{series_id}/aggregate_credits`                                            |
| [`getTvSeriesAlternativeTitles`](https://developer.themoviedb.org/reference/tv-series-alternative-titles)       | `GET /tv/{series_id}/alternative_titles`                                           |
| [`getTvSeriesChanges`](https://developer.themoviedb.org/reference/tv-series-changes)                            | `GET /tv/{series_id}/changes`                                                      |
| [`getTvSeriesContentRatings`](https://developer.themoviedb.org/reference/tv-series-content-ratings)             | `GET /tv/{series_id}/content_ratings`                                              |
| [`getTvSeriesCredits`](https://developer.themoviedb.org/reference/tv-series-credits)                            | `GET /tv/{series_id}/credits`                                                      |
| [`getTvSeriesEpisodeGroups`](https://developer.themoviedb.org/reference/tv-series-episode-groups)               | `GET /tv/{series_id}/episode_groups`                                               |
| [`getTvSeriesExternalIds`](https://developer.themoviedb.org/reference/tv-series-external-ids)                   | `GET /tv/{series_id}/external_ids`                                                 |
| [`getTvSeriesImages`](https://developer.themoviedb.org/reference/tv-series-images)                              | `GET /tv/{series_id}/images`                                                       |
| [`getTvSeriesKeywords`](https://developer.themoviedb.org/reference/tv-series-keywords)                          | `GET /tv/{series_id}/keywords`                                                     |
| [`getLatestTvSeries`](https://developer.themoviedb.org/reference/tv-series-latest-id)                           | `GET /tv/latest`                                                                   |
| [`getTvSeriesLists`](https://developer.themoviedb.org/reference/lists-copy)                                     | `GET /tv/{series_id}/lists`                                                        |
| [`getTvSeriesRecommendations`](https://developer.themoviedb.org/reference/tv-series-recommendations)            | `GET /tv/{series_id}/recommendations`                                              |
| [`getTvSeriesReviews`](https://developer.themoviedb.org/reference/tv-series-reviews)                            | `GET /tv/{series_id}/reviews`                                                      |
| [`getTvSeriesScreenedTheatrically`](https://developer.themoviedb.org/reference/tv-series-screened-theatrically) | `GET /tv/{series_id}/screened_theatrically`                                        |
| [`getSimilarTvSeries`](https://developer.themoviedb.org/reference/tv-series-similar)                            | `GET /tv/{series_id}/similar`                                                      |
| [`getTvSeriesTranslations`](https://developer.themoviedb.org/reference/tv-series-translations)                  | `GET /tv/{series_id}/translations`                                                 |
| [`getTvSeriesVideos`](https://developer.themoviedb.org/reference/tv-series-videos)                              | `GET /tv/{series_id}/videos`                                                       |
| [`getTvSeriesWatchProviders`](https://developer.themoviedb.org/reference/tv-series-watch-providers)             | `GET /tv/{series_id}/watch/providers`                                              |
| [`getTvSeriesAiringToday`](https://developer.themoviedb.org/reference/tv-series-airing-today-list)              | `GET /tv/airing_today`                                                             |
| [`getTvSeriesOnTheAir`](https://developer.themoviedb.org/reference/tv-series-on-the-air-list)                   | `GET /tv/on_the_air`                                                               |
| [`getPopularTvSeries`](https://developer.themoviedb.org/reference/tv-series-popular-list)                       | `GET /tv/popular`                                                                  |
| [`getTopRatedTvSeries`](https://developer.themoviedb.org/reference/tv-series-top-rated-list)                    | `GET /tv/top_rated`                                                                |
| [`getTvChangeList`](https://developer.themoviedb.org/reference/changes-tv-list)                                 | `GET /tv/changes`                                                                  |
| [`getTvSeason`](https://developer.themoviedb.org/reference/tv-season-details)                                   | `GET /tv/{series_id}/season/{season_number}`                                       |
| [`getTvSeasonAggregateCredits`](https://developer.themoviedb.org/reference/tv-season-aggregate-credits)         | `GET /tv/{series_id}/season/{season_number}/aggregate_credits`                     |
| [`getTvSeasonChanges`](https://developer.themoviedb.org/reference/tv-season-changes-by-id)                      | `GET /tv/season/{season_id}/changes`                                               |
| [`getTvSeasonCredits`](https://developer.themoviedb.org/reference/tv-season-credits)                            | `GET /tv/{series_id}/season/{season_number}/credits`                               |
| [`getTvSeasonExternalIds`](https://developer.themoviedb.org/reference/tv-season-external-ids)                   | `GET /tv/{series_id}/season/{season_number}/external_ids`                          |
| [`getTvSeasonImages`](https://developer.themoviedb.org/reference/tv-season-images)                              | `GET /tv/{series_id}/season/{season_number}/images`                                |
| [`getTvSeasonTranslations`](https://developer.themoviedb.org/reference/tv-season-translations)                  | `GET /tv/{series_id}/season/{season_number}/translations`                          |
| [`getTvSeasonVideos`](https://developer.themoviedb.org/reference/tv-season-videos)                              | `GET /tv/{series_id}/season/{season_number}/videos`                                |
| [`getTvSeasonWatchProviders`](https://developer.themoviedb.org/reference/tv-season-watch-providers)             | `GET /tv/{series_id}/season/{season_number}/watch/providers`                       |
| [`getTvEpisode`](https://developer.themoviedb.org/reference/tv-episode-details)                                 | `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}`              |
| [`getTvEpisodeChanges`](https://developer.themoviedb.org/reference/tv-episode-changes-by-id)                    | `GET /tv/episode/{episode_id}/changes`                                             |
| [`getTvEpisodeCredits`](https://developer.themoviedb.org/reference/tv-episode-credits)                          | `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/credits`      |
| [`getTvEpisodeExternalIds`](https://developer.themoviedb.org/reference/tv-episode-external-ids)                 | `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/external_ids` |
| [`getTvEpisodeImages`](https://developer.themoviedb.org/reference/tv-episode-images)                            | `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/images`       |
| [`getTvEpisodeTranslations`](https://developer.themoviedb.org/reference/tv-episode-translations)                | `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/translations` |
| [`getTvEpisodeVideos`](https://developer.themoviedb.org/reference/tv-episode-videos)                            | `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/videos`       |
| [`getTvEpisodeGroup`](https://developer.themoviedb.org/reference/tv-episode-group-details)                      | `GET /tv/episode_group/{tv_episode_group_id}`                                      |

#### People

| Operation                                                                                        | Endpoint                                   |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| [`getPerson`](https://developer.themoviedb.org/reference/person-details)                         | `GET /person/{person_id}`                  |
| [`getPersonChanges`](https://developer.themoviedb.org/reference/person-changes)                  | `GET /person/{person_id}/changes`          |
| [`getPersonCombinedCredits`](https://developer.themoviedb.org/reference/person-combined-credits) | `GET /person/{person_id}/combined_credits` |
| [`getPersonExternalIds`](https://developer.themoviedb.org/reference/person-external-ids)         | `GET /person/{person_id}/external_ids`     |
| [`getPersonImages`](https://developer.themoviedb.org/reference/person-images)                    | `GET /person/{person_id}/images`           |
| [`getLatestPerson`](https://developer.themoviedb.org/reference/person-latest-id)                 | `GET /person/latest`                       |
| [`getPersonMovieCredits`](https://developer.themoviedb.org/reference/person-movie-credits)       | `GET /person/{person_id}/movie_credits`    |
| [`getPersonTvCredits`](https://developer.themoviedb.org/reference/person-tv-credits)             | `GET /person/{person_id}/tv_credits`       |
| [`getPersonTaggedImages`](https://developer.themoviedb.org/reference/person-tagged-images)       | `GET /person/{person_id}/tagged_images`    |
| [`getPersonTranslations`](https://developer.themoviedb.org/reference/translations)               | `GET /person/{person_id}/translations`     |
| [`getPopularPeople`](https://developer.themoviedb.org/reference/person-popular-list)             | `GET /person/popular`                      |
| [`getPersonChangeList`](https://developer.themoviedb.org/reference/changes-people-list)          | `GET /person/changes`                      |

#### Collections

| Operation                                                                                         | Endpoint                                       |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [`getCollection`](https://developer.themoviedb.org/reference/collection-details)                  | `GET /collection/{collection_id}`              |
| [`getCollectionImages`](https://developer.themoviedb.org/reference/collection-images)             | `GET /collection/{collection_id}/images`       |
| [`getCollectionTranslations`](https://developer.themoviedb.org/reference/collection-translations) | `GET /collection/{collection_id}/translations` |

#### Companies

| Operation                                                                                            | Endpoint                                      |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [`getCompany`](https://developer.themoviedb.org/reference/company-details)                           | `GET /company/{company_id}`                   |
| [`getCompanyAlternativeNames`](https://developer.themoviedb.org/reference/company-alternative-names) | `GET /company/{company_id}/alternative_names` |
| [`getCompanyImages`](https://developer.themoviedb.org/reference/company-images)                      | `GET /company/{company_id}/images`            |

#### Networks

| Operation                                                                               | Endpoint                                      |
| --------------------------------------------------------------------------------------- | --------------------------------------------- |
| [`getNetwork`](https://developer.themoviedb.org/reference/network-details)              | `GET /network/{network_id}`                   |
| [`getNetworkAlternativeNames`](https://developer.themoviedb.org/reference/details-copy) | `GET /network/{network_id}/alternative_names` |
| [`getNetworkImages`](https://developer.themoviedb.org/reference/alternative-names-copy) | `GET /network/{network_id}/images`            |

#### Keywords

| Operation                                                                       | Endpoint                           |
| ------------------------------------------------------------------------------- | ---------------------------------- |
| [`getKeyword`](https://developer.themoviedb.org/reference/keyword-details)      | `GET /keyword/{keyword_id}`        |
| [`getKeywordMovies`](https://developer.themoviedb.org/reference/keyword-movies) | `GET /keyword/{keyword_id}/movies` |

#### Credits

| Operation                                                                | Endpoint                  |
| ------------------------------------------------------------------------ | ------------------------- |
| [`getCredit`](https://developer.themoviedb.org/reference/credit-details) | `GET /credit/{credit_id}` |

#### Reviews

| Operation                                                                | Endpoint                  |
| ------------------------------------------------------------------------ | ------------------------- |
| [`getReview`](https://developer.themoviedb.org/reference/review-details) | `GET /review/{review_id}` |

#### Lists

| Operation                                                                                | Endpoint                          |
| ---------------------------------------------------------------------------------------- | --------------------------------- |
| [`getList`](https://developer.themoviedb.org/reference/list-details)                     | `GET /list/{list_id}`             |
| [`getListItemStatus`](https://developer.themoviedb.org/reference/list-check-item-status) | `GET /list/{list_id}/item_status` |

#### Search

| Operation                                                                           | Endpoint                 |
| ----------------------------------------------------------------------------------- | ------------------------ |
| [`searchCollections`](https://developer.themoviedb.org/reference/search-collection) | `GET /search/collection` |
| [`searchCompanies`](https://developer.themoviedb.org/reference/search-company)      | `GET /search/company`    |
| [`searchKeywords`](https://developer.themoviedb.org/reference/search-keyword)       | `GET /search/keyword`    |
| [`searchMovies`](https://developer.themoviedb.org/reference/search-movie)           | `GET /search/movie`      |
| [`searchMulti`](https://developer.themoviedb.org/reference/search-multi)            | `GET /search/multi`      |
| [`searchPeople`](https://developer.themoviedb.org/reference/search-person)          | `GET /search/person`     |
| [`searchTvSeries`](https://developer.themoviedb.org/reference/search-tv)            | `GET /search/tv`         |

#### Discover

| Operation                                                                     | Endpoint              |
| ----------------------------------------------------------------------------- | --------------------- |
| [`discoverMovies`](https://developer.themoviedb.org/reference/discover-movie) | `GET /discover/movie` |
| [`discoverTvSeries`](https://developer.themoviedb.org/reference/discover-tv)  | `GET /discover/tv`    |

#### Find

| Operation                                                                   | Endpoint                  |
| --------------------------------------------------------------------------- | ------------------------- |
| [`findByExternalId`](https://developer.themoviedb.org/reference/find-by-id) | `GET /find/{external_id}` |

#### Trending

| Operation                                                                         | Endpoint                             |
| --------------------------------------------------------------------------------- | ------------------------------------ |
| [`getTrending`](https://developer.themoviedb.org/reference/trending-all)          | `GET /trending/all/{time_window}`    |
| [`getTrendingMovies`](https://developer.themoviedb.org/reference/trending-movies) | `GET /trending/movie/{time_window}`  |
| [`getTrendingPeople`](https://developer.themoviedb.org/reference/trending-people) | `GET /trending/person/{time_window}` |
| [`getTrendingTvSeries`](https://developer.themoviedb.org/reference/trending-tv)   | `GET /trending/tv/{time_window}`     |

#### Not yet implemented

The 36 session-scoped operations (authentication, account, ratings, list editing, guest sessions and account states) need a user session and are planned for a later release: `GET /authentication`, `GET /account/{account_id}`, `POST /account/{account_id}/favorite`, `POST /account/{account_id}/watchlist`, `GET /account/{account_id}/favorite/movies`, `GET /account/{account_id}/favorite/tv`, `GET /account/{account_id}/lists`, `GET /account/{account_id}/rated/movies`, `GET /account/{account_id}/rated/tv`, `GET /account/{account_id}/rated/tv/episodes`, `GET /account/{account_id}/watchlist/movies`, `GET /account/{account_id}/watchlist/tv`, `GET /authentication/guest_session/new`, `GET /authentication/token/new`, `POST /authentication/session/new`, `POST /authentication/session/convert/4`, `POST /authentication/token/validate_with_login`, `DELETE /authentication/session`, `GET /guest_session/{guest_session_id}/rated/movies`, `GET /guest_session/{guest_session_id}/rated/tv`, `GET /guest_session/{guest_session_id}/rated/tv/episodes`, `POST /list/{list_id}/add_item`, `POST /list/{list_id}/clear`, `POST /list`, `DELETE /list/{list_id}`, `POST /list/{list_id}/remove_item`, `GET /movie/{movie_id}/account_states`, `POST /movie/{movie_id}/rating`, `DELETE /movie/{movie_id}/rating`, `GET /tv/{series_id}/account_states`, `POST /tv/{series_id}/rating`, `DELETE /tv/{series_id}/rating`, `GET /tv/{series_id}/season/{season_number}/account_states`, `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/account_states`, `POST /tv/{series_id}/season/{season_number}/episode/{episode_number}/rating`, `DELETE /tv/{series_id}/season/{season_number}/episode/{episode_number}/rating`.

<!-- coverage:end -->

## 🤝 Contributing

The project uses [Vite+][viteplus] as a unified toolchain (Oxlint + Oxfmt + tsdown + Vitest) and [Bumpy][bumpy] for versioning and release. See [`docs/plan.md`][plan] for the design decisions and [`AGENTS.md`][agents] for the conventions.

```bash
vp install              # install dependencies
vp check --fix          # format + lint + typecheck (with autofixes)
vp test                 # run Vitest
yarn fixtures:record    # re-record TMDB responses (needs TMDB_API_TOKEN or TMDB_API_KEY in .env)
yarn bumpy add          # create a bump file for your PR
```

Schemas are written from recorded responses, not from TMDB's OpenAPI spec, which names every field but marks none as nullable. `node scripts/codegen/draft.ts <operation> [path]` prints a draft schema from the evidence in `fixtures/shapes.json`, and `node scripts/codegen/scaffold.ts <domain>` writes the op files and specs for new entries in `scripts/codegen/operations.ts`.

## 📣 Acknowledgements

tmdbkit's request layer and conventions follow [discordkit][discordkit], and it succeeds the GraphQL-based [`tmdb-api`][tmdb_api].

This product uses the TMDB API but is not endorsed or certified by TMDB. If your app uses tmdbkit, [TMDB's terms][tmdb_faq] ask you to attribute TMDB as the source of its data and images, in your app's "About" or "Credits" section.

## 🥂 License

Released under the [MIT license][license] © [Drake Costa][personal-website].

[npm_badge]: https://img.shields.io/npm/v/@saeris/tmdbkit.svg?style=flat
[npm]: https://www.npmjs.com/package/@saeris/tmdbkit
[ci_badge]: https://github.com/Saeris/tmdbkit/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/Saeris/tmdbkit/actions/workflows/ci.yml
[tmdb]: https://www.themoviedb.org/
[tmdb_api_settings]: https://www.themoviedb.org/settings/api
[tmdb_rate_limiting]: https://developer.themoviedb.org/docs/rate-limiting
[tmdb_faq]: https://developer.themoviedb.org/docs/faq
[valibot]: https://github.com/fabian-hiller/valibot
[viteplus]: https://viteplus.dev/
[bumpy]: https://bumpy.varlock.dev/
[discordkit]: https://github.com/discordkit/discordkit
[tmdb_api]: https://github.com/Saeris/tmdb-api
[plan]: https://github.com/Saeris/tmdbkit/blob/main/docs/plan.md
[agents]: https://github.com/Saeris/tmdbkit/blob/main/AGENTS.md
[license]: https://github.com/Saeris/tmdbkit/blob/main/LICENSE.md
[personal-website]: https://saeris.gg
