import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  discoverTvSeries,
  discoverTvSeriesSchema
} from "../discoverTvSeries.js";
import { pagedTvResultsSchema } from "../../tv/types/TvListItem.js";

describe(`discoverTvSeries`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/discover/tv`,
    discoverTvSeriesSchema,
    pagedTvResultsSchema
  );

  it(`sends GET /discover/tv and resolves the validated response`, async () => {
    await expect(
      toValidated(
        discoverTvSeries,
        discoverTvSeriesSchema,
        pagedTvResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/discover/tv`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedTvResultsSchema`, () => {
  // Real responses (fixtures/discover-tv) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`discover-tv`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedTvResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
