import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesCredits,
  getTvSeriesCreditsSchema
} from "../getTvSeriesCredits.js";
import { tvCreditsSchema } from "../types/TvCredits.js";

describe(`getTvSeriesCredits`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/credits`,
    getTvSeriesCreditsSchema,
    tvCreditsSchema
  );

  it(`sends GET /tv/{series_id}/credits and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesCredits,
        getTvSeriesCreditsSchema,
        tvCreditsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/credits`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`tvCreditsSchema`, () => {
  // Real responses (fixtures/tv-credits) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-credits`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(tvCreditsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
