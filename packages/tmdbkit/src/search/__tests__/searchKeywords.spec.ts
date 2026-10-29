import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { searchKeywords, searchKeywordsSchema } from "../searchKeywords.js";
import { pagedKeywordResultsSchema } from "../../types/Keyword.js";

describe(`searchKeywords`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/search/keyword`,
    searchKeywordsSchema,
    pagedKeywordResultsSchema
  );

  it(`sends GET /search/keyword and resolves the validated response`, async () => {
    await expect(
      toValidated(
        searchKeywords,
        searchKeywordsSchema,
        pagedKeywordResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/search/keyword`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params, query: config.query })
    );
  });
});

describe(`pagedKeywordResultsSchema`, () => {
  // Real responses (fixtures/search-keyword) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`search-keyword`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedKeywordResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
