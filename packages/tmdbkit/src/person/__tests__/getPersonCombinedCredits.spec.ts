import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getPersonCombinedCredits,
  getPersonCombinedCreditsSchema
} from "../getPersonCombinedCredits.js";
import { personCombinedCreditsSchema } from "../types/PersonCredits.js";

describe(`getPersonCombinedCredits`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/person/:personId/combined_credits`,
    getPersonCombinedCreditsSchema,
    personCombinedCreditsSchema
  );

  it(`sends GET /person/{person_id}/combined_credits and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPersonCombinedCredits,
        getPersonCombinedCreditsSchema,
        personCombinedCreditsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/person/${config.personId}/combined_credits`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`personCombinedCreditsSchema`, () => {
  // Real responses (fixtures/person-combined-credits) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`person-combined-credits`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(personCombinedCreditsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
