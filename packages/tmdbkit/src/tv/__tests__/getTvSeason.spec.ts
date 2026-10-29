import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getTvSeason, getTvSeasonSchema } from "../getTvSeason.js";
import { tvSeasonDetailsSchema } from "../types/TvSeasonDetails.js";

describe(`getTvSeason`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber`,
    getTvSeasonSchema,
    tvSeasonDetailsSchema
  );

  it(`sends GET /tv/{series_id}/season/{season_number} and resolves the validated response`, async () => {
    await expect(
      toValidated(getTvSeason, getTvSeasonSchema, tvSeasonDetailsSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/season/${config.seasonNumber}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`tvSeasonDetailsSchema`, () => {
  // Real responses (fixtures/tv-season-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-season-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(tvSeasonDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
