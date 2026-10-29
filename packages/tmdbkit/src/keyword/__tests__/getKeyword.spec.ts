import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getKeyword, getKeywordSchema } from "../getKeyword.js";
import { keywordSchema } from "../../types/Keyword.js";

describe(`getKeyword`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/keyword/:keywordId`,
    getKeywordSchema,
    keywordSchema
  );

  it(`sends GET /keyword/{keyword_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(getKeyword, getKeywordSchema, keywordSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/keyword/${config.keywordId}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`keywordSchema`, () => {
  // Real responses (fixtures/keyword-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`keyword-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(keywordSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
