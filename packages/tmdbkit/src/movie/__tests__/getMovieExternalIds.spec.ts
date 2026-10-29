import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getMovieExternalIds,
  getMovieExternalIdsSchema
} from "../getMovieExternalIds.js";
import { movieExternalIdsSchema } from "../types/MovieExternalIds.js";

describe(`getMovieExternalIds`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/external_ids`,
    getMovieExternalIdsSchema,
    movieExternalIdsSchema
  );

  it(`sends GET /movie/{movie_id}/external_ids and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieExternalIds,
        getMovieExternalIdsSchema,
        movieExternalIdsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/external_ids`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`movieExternalIdsSchema`, () => {
  // Real responses (fixtures/movie-external-ids) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-external-ids`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(movieExternalIdsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
