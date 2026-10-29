import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getCompany, getCompanySchema } from "../getCompany.js";
import { companyDetailsSchema } from "../types/CompanyDetails.js";

describe(`getCompany`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/company/:companyId`,
    getCompanySchema,
    companyDetailsSchema
  );

  it(`sends GET /company/{company_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(getCompany, getCompanySchema, companyDetailsSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/company/${config.companyId}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`companyDetailsSchema`, () => {
  // Real responses (fixtures/company-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`company-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(companyDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
