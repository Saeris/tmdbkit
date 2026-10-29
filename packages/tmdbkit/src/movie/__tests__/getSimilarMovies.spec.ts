import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getSimilarMovies,
  getSimilarMoviesSchema
} from "../getSimilarMovies.js";
import { pagedMovieResultsSchema } from "../types/MovieListItem.js";

describe(`getSimilarMovies`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/similar`,
    getSimilarMoviesSchema,
    pagedMovieResultsSchema
  );

  it(`sends GET /movie/{movie_id}/similar and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getSimilarMovies,
        getSimilarMoviesSchema,
        pagedMovieResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/similar`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedMovieResultsSchema`, () => {
  // Real responses (fixtures/movie-similar) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-similar`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedMovieResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
