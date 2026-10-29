import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getLanguages } from "../getLanguages.js";
import { languagesSchema } from "../types/Language.js";

describe(`getLanguages`, { repeats: 5 }, () => {
  const { expected, requests } = mockUtils.request.get(
    `/configuration/languages`,
    null,
    languagesSchema
  );

  it(`sends GET /configuration/languages and resolves the validated response`, async () => {
    await expect(
      toValidated(getLanguages, null, languagesSchema)()
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/configuration/languages`
    );
  });
});

describe(`languagesSchema`, () => {
  // Real responses (fixtures/configuration-languages) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`configuration-languages`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(languagesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
