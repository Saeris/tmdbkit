import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesAiringToday,
  getTvSeriesAiringTodaySchema
} from "../getTvSeriesAiringToday.js";
import { pagedTvResultsSchema } from "../types/TvListItem.js";

describe(`getTvSeriesAiringToday`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/airing_today`,
    getTvSeriesAiringTodaySchema,
    pagedTvResultsSchema
  );

  it(`sends GET /tv/airing_today and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesAiringToday,
        getTvSeriesAiringTodaySchema,
        pagedTvResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/tv/airing_today`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedTvResultsSchema`, () => {
  // Real responses (fixtures/tv-airing-today) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-airing-today`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedTvResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
