import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getCompanyAlternativeNames,
  getCompanyAlternativeNamesSchema
} from "../getCompanyAlternativeNames.js";
import { alternativeNamesSchema } from "../../types/AlternativeNames.js";

describe(`getCompanyAlternativeNames`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/company/:companyId/alternative_names`,
    getCompanyAlternativeNamesSchema,
    alternativeNamesSchema
  );

  it(`sends GET /company/{company_id}/alternative_names and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getCompanyAlternativeNames,
        getCompanyAlternativeNamesSchema,
        alternativeNamesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/company/${config.companyId}/alternative_names`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`alternativeNamesSchema`, () => {
  // Real responses (fixtures/company-alternative-names) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`company-alternative-names`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(alternativeNamesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
