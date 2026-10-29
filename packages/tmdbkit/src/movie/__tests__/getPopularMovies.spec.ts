import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getPopularMovies,
  getPopularMoviesSchema
} from "../getPopularMovies.js";
import { pagedMovieResultsSchema } from "../types/MovieListItem.js";

describe(`getPopularMovies`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/popular`,
    getPopularMoviesSchema,
    pagedMovieResultsSchema
  );

  it(`sends GET /movie/popular and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPopularMovies,
        getPopularMoviesSchema,
        pagedMovieResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/movie/popular`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedMovieResultsSchema`, () => {
  // Real responses (fixtures/movie-popular) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-popular`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedMovieResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
