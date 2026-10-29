import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesRecommendations,
  getTvSeriesRecommendationsSchema
} from "../getTvSeriesRecommendations.js";
import { pagedTvMediaResultsSchema } from "../types/TvListItem.js";

describe(`getTvSeriesRecommendations`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/recommendations`,
    getTvSeriesRecommendationsSchema,
    pagedTvMediaResultsSchema
  );

  it(`sends GET /tv/{series_id}/recommendations and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesRecommendations,
        getTvSeriesRecommendationsSchema,
        pagedTvMediaResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/recommendations`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedTvMediaResultsSchema`, () => {
  // Real responses (fixtures/tv-recommendations) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-recommendations`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedTvMediaResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
