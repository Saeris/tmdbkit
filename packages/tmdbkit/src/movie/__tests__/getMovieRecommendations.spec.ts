import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getMovieRecommendations,
  getMovieRecommendationsSchema
} from "../getMovieRecommendations.js";
import { pagedMovieMediaResultsSchema } from "../types/MovieListItem.js";

describe(`getMovieRecommendations`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/recommendations`,
    getMovieRecommendationsSchema,
    pagedMovieMediaResultsSchema
  );

  it(`sends GET /movie/{movie_id}/recommendations and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieRecommendations,
        getMovieRecommendationsSchema,
        pagedMovieMediaResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/recommendations`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedMovieMediaResultsSchema`, () => {
  // Real responses (fixtures/movie-recommendations) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-recommendations`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedMovieMediaResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
