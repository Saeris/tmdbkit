import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getMovieWatchProviderList,
  getMovieWatchProviderListSchema
} from "../getMovieWatchProviderList.js";
import { watchProviderListSchema } from "../types/WatchProviderList.js";

describe(`getMovieWatchProviderList`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/watch/providers/movie`,
    getMovieWatchProviderListSchema,
    watchProviderListSchema
  );

  it(`sends GET /watch/providers/movie and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieWatchProviderList,
        getMovieWatchProviderListSchema,
        watchProviderListSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/watch/providers/movie`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`watchProviderListSchema`, () => {
  // Real responses (fixtures/watch-providers-movie) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`watch-providers-movie`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(watchProviderListSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
