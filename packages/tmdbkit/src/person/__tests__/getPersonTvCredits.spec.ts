import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getPersonTvCredits,
  getPersonTvCreditsSchema
} from "../getPersonTvCredits.js";
import { personTvCreditsSchema } from "../types/PersonCredits.js";

describe(`getPersonTvCredits`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/person/:personId/tv_credits`,
    getPersonTvCreditsSchema,
    personTvCreditsSchema
  );

  it(`sends GET /person/{person_id}/tv_credits and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPersonTvCredits,
        getPersonTvCreditsSchema,
        personTvCreditsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/person/${config.personId}/tv_credits`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`personTvCreditsSchema`, () => {
  // Real responses (fixtures/person-tv-credits) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`person-tv-credits`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(personTvCreditsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
