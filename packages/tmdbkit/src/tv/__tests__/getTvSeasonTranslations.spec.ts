import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeasonTranslations,
  getTvSeasonTranslationsSchema
} from "../getTvSeasonTranslations.js";
import { nameOverviewTranslationsSchema } from "../types/TvTranslations.js";

describe(`getTvSeasonTranslations`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber/translations`,
    getTvSeasonTranslationsSchema,
    nameOverviewTranslationsSchema
  );

  it(`sends GET /tv/{series_id}/season/{season_number}/translations and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeasonTranslations,
        getTvSeasonTranslationsSchema,
        nameOverviewTranslationsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/season/${config.seasonNumber}/translations`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`nameOverviewTranslationsSchema`, () => {
  // Real responses (fixtures/tv-season-translations) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-season-translations`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(nameOverviewTranslationsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
