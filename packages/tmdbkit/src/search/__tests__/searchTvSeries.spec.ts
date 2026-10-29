import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { searchTvSeries, searchTvSeriesSchema } from "../searchTvSeries.js";
import { pagedTvResultsSchema } from "../../tv/types/TvListItem.js";

describe(`searchTvSeries`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/search/tv`,
    searchTvSeriesSchema,
    pagedTvResultsSchema
  );

  it(`sends GET /search/tv and resolves the validated response`, async () => {
    await expect(
      toValidated(
        searchTvSeries,
        searchTvSeriesSchema,
        pagedTvResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/search/tv`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params, query: config.query })
    );
  });
});

describe(`pagedTvResultsSchema`, () => {
  // Real responses (fixtures/search-tv) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`search-tv`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedTvResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
