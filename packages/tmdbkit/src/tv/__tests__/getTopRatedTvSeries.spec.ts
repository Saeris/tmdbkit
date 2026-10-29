import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTopRatedTvSeries,
  getTopRatedTvSeriesSchema
} from "../getTopRatedTvSeries.js";
import { pagedTvResultsSchema } from "../types/TvListItem.js";

describe(`getTopRatedTvSeries`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/top_rated`,
    getTopRatedTvSeriesSchema,
    pagedTvResultsSchema
  );

  it(`sends GET /tv/top_rated and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTopRatedTvSeries,
        getTopRatedTvSeriesSchema,
        pagedTvResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/tv/top_rated`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedTvResultsSchema`, () => {
  // Real responses (fixtures/tv-top-rated) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-top-rated`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedTvResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
