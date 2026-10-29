import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesTranslations,
  getTvSeriesTranslationsSchema
} from "../getTvSeriesTranslations.js";
import { tvTranslationsSchema } from "../types/TvTranslations.js";

describe(`getTvSeriesTranslations`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/translations`,
    getTvSeriesTranslationsSchema,
    tvTranslationsSchema
  );

  it(`sends GET /tv/{series_id}/translations and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesTranslations,
        getTvSeriesTranslationsSchema,
        tvTranslationsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/translations`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`tvTranslationsSchema`, () => {
  // Real responses (fixtures/tv-translations) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-translations`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(tvTranslationsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
