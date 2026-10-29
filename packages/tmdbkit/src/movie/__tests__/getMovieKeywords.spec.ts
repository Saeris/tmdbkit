import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getMovieKeywords,
  getMovieKeywordsSchema
} from "../getMovieKeywords.js";
import { movieKeywordsSchema } from "../types/MovieKeywords.js";

describe(`getMovieKeywords`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/keywords`,
    getMovieKeywordsSchema,
    movieKeywordsSchema
  );

  it(`sends GET /movie/{movie_id}/keywords and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieKeywords,
        getMovieKeywordsSchema,
        movieKeywordsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/keywords`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`movieKeywordsSchema`, () => {
  // Real responses (fixtures/movie-keywords) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-keywords`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(movieKeywordsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
