import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeasonCredits,
  getTvSeasonCreditsSchema
} from "../getTvSeasonCredits.js";
import { tvCreditsSchema } from "../types/TvCredits.js";

describe(`getTvSeasonCredits`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber/credits`,
    getTvSeasonCreditsSchema,
    tvCreditsSchema
  );

  it(`sends GET /tv/{series_id}/season/{season_number}/credits and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeasonCredits,
        getTvSeasonCreditsSchema,
        tvCreditsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/season/${config.seasonNumber}/credits`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`tvCreditsSchema`, () => {
  // Real responses (fixtures/tv-season-credits) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-season-credits`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(tvCreditsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
