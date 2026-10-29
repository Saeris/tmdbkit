import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getMovieCredits, getMovieCreditsSchema } from "../getMovieCredits.js";
import { movieCreditsSchema } from "../types/MovieCredits.js";

describe(`getMovieCredits`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/credits`,
    getMovieCreditsSchema,
    movieCreditsSchema
  );

  it(`sends GET /movie/{movie_id}/credits and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieCredits,
        getMovieCreditsSchema,
        movieCreditsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/credits`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`movieCreditsSchema`, () => {
  // Real responses (fixtures/movie-credits) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-credits`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(movieCreditsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
