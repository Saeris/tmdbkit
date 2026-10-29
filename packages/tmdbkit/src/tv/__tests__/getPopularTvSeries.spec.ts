import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getPopularTvSeries,
  getPopularTvSeriesSchema
} from "../getPopularTvSeries.js";
import { pagedTvResultsSchema } from "../types/TvListItem.js";

describe(`getPopularTvSeries`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/popular`,
    getPopularTvSeriesSchema,
    pagedTvResultsSchema
  );

  it(`sends GET /tv/popular and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPopularTvSeries,
        getPopularTvSeriesSchema,
        pagedTvResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/tv/popular`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedTvResultsSchema`, () => {
  // Real responses (fixtures/tv-popular) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-popular`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedTvResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
