import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getMovieChanges, getMovieChangesSchema } from "../getMovieChanges.js";
import { changesSchema } from "../../types/Changes.js";

describe(`getMovieChanges`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/changes`,
    getMovieChangesSchema,
    changesSchema
  );

  it(`sends GET /movie/{movie_id}/changes and resolves the validated response`, async () => {
    await expect(
      toValidated(getMovieChanges, getMovieChangesSchema, changesSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/changes`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`changesSchema`, () => {
  // Real responses (fixtures/movie-changes) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-changes`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(changesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
