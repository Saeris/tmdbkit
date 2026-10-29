import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getTimezones } from "../getTimezones.js";
import { timezonesSchema } from "../types/Timezone.js";

describe(`getTimezones`, { repeats: 5 }, () => {
  const { expected, requests } = mockUtils.request.get(
    `/configuration/timezones`,
    null,
    timezonesSchema
  );

  it(`sends GET /configuration/timezones and resolves the validated response`, async () => {
    await expect(
      toValidated(getTimezones, null, timezonesSchema)()
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/configuration/timezones`
    );
  });
});

describe(`timezonesSchema`, () => {
  // Real responses (fixtures/configuration-timezones) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`configuration-timezones`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(timezonesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
