import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { searchMulti, searchMultiSchema } from "../searchMulti.js";
import { pagedMediaResultsSchema } from "../../types/MediaListItem.js";

describe(`searchMulti`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/search/multi`,
    searchMultiSchema,
    pagedMediaResultsSchema
  );

  it(`sends GET /search/multi and resolves the validated response`, async () => {
    await expect(
      toValidated(
        searchMulti,
        searchMultiSchema,
        pagedMediaResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/search/multi`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params, query: config.query })
    );
  });
});

describe(`pagedMediaResultsSchema`, () => {
  // Real responses (fixtures/search-multi) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`search-multi`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedMediaResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
