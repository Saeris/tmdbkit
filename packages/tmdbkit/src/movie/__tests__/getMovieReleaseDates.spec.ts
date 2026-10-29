import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getMovieReleaseDates,
  getMovieReleaseDatesSchema
} from "../getMovieReleaseDates.js";
import { movieReleaseDatesSchema } from "../types/MovieReleaseDates.js";

describe(`getMovieReleaseDates`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/release_dates`,
    getMovieReleaseDatesSchema,
    movieReleaseDatesSchema
  );

  it(`sends GET /movie/{movie_id}/release_dates and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieReleaseDates,
        getMovieReleaseDatesSchema,
        movieReleaseDatesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/release_dates`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`movieReleaseDatesSchema`, () => {
  // Real responses (fixtures/movie-release-dates) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-release-dates`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(movieReleaseDatesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
