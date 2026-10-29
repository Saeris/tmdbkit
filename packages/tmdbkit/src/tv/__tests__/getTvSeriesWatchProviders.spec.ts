import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesWatchProviders,
  getTvSeriesWatchProvidersSchema
} from "../getTvSeriesWatchProviders.js";
import { watchProvidersSchema } from "../../watch-providers/types/WatchProviders.js";

describe(`getTvSeriesWatchProviders`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/watch/providers`,
    getTvSeriesWatchProvidersSchema,
    watchProvidersSchema
  );

  it(`sends GET /tv/{series_id}/watch/providers and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesWatchProviders,
        getTvSeriesWatchProvidersSchema,
        watchProvidersSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/watch/providers`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`watchProvidersSchema`, () => {
  // Real responses (fixtures/tv-watch-providers) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-watch-providers`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(watchProvidersSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
