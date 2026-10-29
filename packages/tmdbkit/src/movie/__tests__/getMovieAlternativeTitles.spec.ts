import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getMovieAlternativeTitles,
  getMovieAlternativeTitlesSchema
} from "../getMovieAlternativeTitles.js";
import { movieAlternativeTitlesSchema } from "../types/MovieAlternativeTitles.js";

describe(`getMovieAlternativeTitles`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/alternative_titles`,
    getMovieAlternativeTitlesSchema,
    movieAlternativeTitlesSchema
  );

  it(`sends GET /movie/{movie_id}/alternative_titles and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieAlternativeTitles,
        getMovieAlternativeTitlesSchema,
        movieAlternativeTitlesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/alternative_titles`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`movieAlternativeTitlesSchema`, () => {
  // Real responses (fixtures/movie-alternative-titles) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-alternative-titles`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(movieAlternativeTitlesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
