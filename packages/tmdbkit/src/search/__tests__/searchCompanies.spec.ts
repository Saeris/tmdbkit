import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { searchCompanies, searchCompaniesSchema } from "../searchCompanies.js";
import { pagedCompanyResultsSchema } from "../../company/types/CompanyListItem.js";

describe(`searchCompanies`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/search/company`,
    searchCompaniesSchema,
    pagedCompanyResultsSchema
  );

  it(`sends GET /search/company and resolves the validated response`, async () => {
    await expect(
      toValidated(
        searchCompanies,
        searchCompaniesSchema,
        pagedCompanyResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/search/company`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params, query: config.query })
    );
  });
});

describe(`pagedCompanyResultsSchema`, () => {
  // Real responses (fixtures/search-company) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`search-company`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedCompanyResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
