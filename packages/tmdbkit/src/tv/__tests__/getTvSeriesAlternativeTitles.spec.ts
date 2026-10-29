import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesAlternativeTitles,
  getTvSeriesAlternativeTitlesSchema
} from "../getTvSeriesAlternativeTitles.js";
import { tvAlternativeTitlesSchema } from "../types/TvAlternativeTitles.js";

describe(`getTvSeriesAlternativeTitles`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/alternative_titles`,
    getTvSeriesAlternativeTitlesSchema,
    tvAlternativeTitlesSchema
  );

  it(`sends GET /tv/{series_id}/alternative_titles and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesAlternativeTitles,
        getTvSeriesAlternativeTitlesSchema,
        tvAlternativeTitlesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/alternative_titles`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`tvAlternativeTitlesSchema`, () => {
  // Real responses (fixtures/tv-alternative-titles) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-alternative-titles`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(tvAlternativeTitlesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
