import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvWatchProviderList,
  getTvWatchProviderListSchema
} from "../getTvWatchProviderList.js";
import { watchProviderListSchema } from "../types/WatchProviderList.js";

describe(`getTvWatchProviderList`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/watch/providers/tv`,
    getTvWatchProviderListSchema,
    watchProviderListSchema
  );

  it(`sends GET /watch/providers/tv and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvWatchProviderList,
        getTvWatchProviderListSchema,
        watchProviderListSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/watch/providers/tv`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`watchProviderListSchema`, () => {
  // Real responses (fixtures/watch-providers-tv) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`watch-providers-tv`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(watchProviderListSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
