import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getWatchProviderRegions,
  getWatchProviderRegionsSchema
} from "../getWatchProviderRegions.js";
import { watchProviderRegionsSchema } from "../types/WatchProviderRegion.js";

describe(`getWatchProviderRegions`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/watch/providers/regions`,
    getWatchProviderRegionsSchema,
    watchProviderRegionsSchema
  );

  it(`sends GET /watch/providers/regions and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getWatchProviderRegions,
        getWatchProviderRegionsSchema,
        watchProviderRegionsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/watch/providers/regions`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`watchProviderRegionsSchema`, () => {
  // Real responses (fixtures/watch-providers-regions) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`watch-providers-regions`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(watchProviderRegionsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
