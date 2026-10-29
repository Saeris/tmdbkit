import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTopRatedMovies,
  getTopRatedMoviesSchema
} from "../getTopRatedMovies.js";
import { pagedMovieResultsSchema } from "../types/MovieListItem.js";

describe(`getTopRatedMovies`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/top_rated`,
    getTopRatedMoviesSchema,
    pagedMovieResultsSchema
  );

  it(`sends GET /movie/top_rated and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTopRatedMovies,
        getTopRatedMoviesSchema,
        pagedMovieResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/movie/top_rated`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedMovieResultsSchema`, () => {
  // Real responses (fixtures/movie-top-rated) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-top-rated`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedMovieResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
