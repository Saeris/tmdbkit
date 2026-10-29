import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getConfiguration } from "../getConfiguration.js";
import { configurationDetailsSchema } from "../types/ConfigurationDetails.js";

describe(`getConfiguration`, { repeats: 5 }, () => {
  const { expected, requests } = mockUtils.request.get(
    `/configuration`,
    null,
    configurationDetailsSchema
  );

  it(`sends GET /configuration and resolves the validated response`, async () => {
    await expect(
      toValidated(getConfiguration, null, configurationDetailsSchema)()
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/configuration`);
  });
});

describe(`configurationDetailsSchema`, () => {
  // Real responses (fixtures/configuration-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`configuration-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(configurationDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
