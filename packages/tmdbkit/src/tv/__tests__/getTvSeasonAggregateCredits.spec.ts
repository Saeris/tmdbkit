import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeasonAggregateCredits,
  getTvSeasonAggregateCreditsSchema
} from "../getTvSeasonAggregateCredits.js";
import { aggregateCreditsSchema } from "../types/AggregateCredits.js";

describe(`getTvSeasonAggregateCredits`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber/aggregate_credits`,
    getTvSeasonAggregateCreditsSchema,
    aggregateCreditsSchema
  );

  it(`sends GET /tv/{series_id}/season/{season_number}/aggregate_credits and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeasonAggregateCredits,
        getTvSeasonAggregateCreditsSchema,
        aggregateCreditsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/season/${config.seasonNumber}/aggregate_credits`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`aggregateCreditsSchema`, () => {
  // Real responses (fixtures/tv-season-aggregate-credits) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-season-aggregate-credits`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(aggregateCreditsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
