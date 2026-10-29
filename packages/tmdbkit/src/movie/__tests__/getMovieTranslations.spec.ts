import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getMovieTranslations,
  getMovieTranslationsSchema
} from "../getMovieTranslations.js";
import { movieTranslationsSchema } from "../types/MovieTranslations.js";

describe(`getMovieTranslations`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/translations`,
    getMovieTranslationsSchema,
    movieTranslationsSchema
  );

  it(`sends GET /movie/{movie_id}/translations and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieTranslations,
        getMovieTranslationsSchema,
        movieTranslationsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/translations`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`movieTranslationsSchema`, () => {
  // Real responses (fixtures/movie-translations) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-translations`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(movieTranslationsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
