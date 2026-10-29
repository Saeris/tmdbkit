import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getPersonTranslations,
  getPersonTranslationsSchema
} from "../getPersonTranslations.js";
import { personTranslationsSchema } from "../types/PersonTranslations.js";

describe(`getPersonTranslations`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/person/:personId/translations`,
    getPersonTranslationsSchema,
    personTranslationsSchema
  );

  it(`sends GET /person/{person_id}/translations and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPersonTranslations,
        getPersonTranslationsSchema,
        personTranslationsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/person/${config.personId}/translations`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`personTranslationsSchema`, () => {
  // Real responses (fixtures/person-translations) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`person-translations`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(personTranslationsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
