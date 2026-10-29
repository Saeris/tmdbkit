import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getCredit, getCreditSchema } from "../getCredit.js";
import { creditDetailsSchema } from "../types/CreditDetails.js";

describe(`getCredit`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/credit/:creditId`,
    getCreditSchema,
    creditDetailsSchema
  );

  it(`sends GET /credit/{credit_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(getCredit, getCreditSchema, creditDetailsSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/credit/${config.creditId}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`creditDetailsSchema`, () => {
  // Real responses (fixtures/credit-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`credit-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(creditDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
