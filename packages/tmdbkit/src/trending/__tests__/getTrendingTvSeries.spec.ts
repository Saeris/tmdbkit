import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTrendingTvSeries,
  getTrendingTvSeriesSchema
} from "../getTrendingTvSeries.js";
import { pagedTvMediaResultsSchema } from "../../tv/types/TvListItem.js";

describe(`getTrendingTvSeries`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/trending/tv/:timeWindow`,
    getTrendingTvSeriesSchema,
    pagedTvMediaResultsSchema
  );

  it(`sends GET /trending/tv/{time_window} and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTrendingTvSeries,
        getTrendingTvSeriesSchema,
        pagedTvMediaResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/trending/tv/${config.timeWindow}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedTvMediaResultsSchema`, () => {
  // Real responses (fixtures/trending-tv) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`trending-tv`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedTvMediaResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
