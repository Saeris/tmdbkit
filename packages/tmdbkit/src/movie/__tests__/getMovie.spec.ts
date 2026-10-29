import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getMovie, getMovieSchema } from "../getMovie.js";
import { movieDetailsSchema } from "../types/MovieDetails.js";

describe(`getMovie`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId`,
    getMovieSchema,
    movieDetailsSchema
  );

  it(`sends GET /movie/{movie_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(getMovie, getMovieSchema, movieDetailsSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`movieDetailsSchema`, () => {
  // Real responses (fixtures/movie-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(movieDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
