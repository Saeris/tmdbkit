import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTrendingMovies,
  getTrendingMoviesSchema
} from "../getTrendingMovies.js";
import { pagedMovieMediaResultsSchema } from "../../movie/types/MovieListItem.js";

describe(`getTrendingMovies`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/trending/movie/:timeWindow`,
    getTrendingMoviesSchema,
    pagedMovieMediaResultsSchema
  );

  it(`sends GET /trending/movie/{time_window} and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTrendingMovies,
        getTrendingMoviesSchema,
        pagedMovieMediaResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/trending/movie/${config.timeWindow}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedMovieMediaResultsSchema`, () => {
  // Real responses (fixtures/trending-movie) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`trending-movie`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedMovieMediaResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
