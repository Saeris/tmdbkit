import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getUpcomingMovies,
  getUpcomingMoviesSchema
} from "../getUpcomingMovies.js";
import { datedMovieResultsSchema } from "../types/MovieListItem.js";

describe(`getUpcomingMovies`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/upcoming`,
    getUpcomingMoviesSchema,
    datedMovieResultsSchema
  );

  it(`sends GET /movie/upcoming and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getUpcomingMovies,
        getUpcomingMoviesSchema,
        datedMovieResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/movie/upcoming`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`datedMovieResultsSchema`, () => {
  // Real responses (fixtures/movie-upcoming) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-upcoming`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(datedMovieResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
