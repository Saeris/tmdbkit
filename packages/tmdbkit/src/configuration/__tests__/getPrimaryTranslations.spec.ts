import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getPrimaryTranslations } from "../getPrimaryTranslations.js";
import { primaryTranslationsSchema } from "../types/PrimaryTranslations.js";

describe(`getPrimaryTranslations`, { repeats: 5 }, () => {
  const { expected, requests } = mockUtils.request.get(
    `/configuration/primary_translations`,
    null,
    primaryTranslationsSchema
  );

  it(`sends GET /configuration/primary_translations and resolves the validated response`, async () => {
    await expect(
      toValidated(getPrimaryTranslations, null, primaryTranslationsSchema)()
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/configuration/primary_translations`
    );
  });
});

describe(`primaryTranslationsSchema`, () => {
  // Real responses (fixtures/configuration-primary-translations) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`configuration-primary-translations`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(primaryTranslationsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
