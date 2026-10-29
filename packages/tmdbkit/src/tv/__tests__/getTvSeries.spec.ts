import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getTvSeries, getTvSeriesSchema } from "../getTvSeries.js";
import { tvSeriesDetailsSchema } from "../types/TvSeriesDetails.js";

describe(`getTvSeries`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId`,
    getTvSeriesSchema,
    tvSeriesDetailsSchema
  );

  it(`sends GET /tv/{series_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(getTvSeries, getTvSeriesSchema, tvSeriesDetailsSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/tv/${config.seriesId}`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`tvSeriesDetailsSchema`, () => {
  // Real responses (fixtures/tv-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(tvSeriesDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
