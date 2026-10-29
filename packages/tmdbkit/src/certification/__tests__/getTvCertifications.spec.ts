import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getTvCertifications } from "../getTvCertifications.js";
import { certificationsSchema } from "../types/Certifications.js";

describe(`getTvCertifications`, { repeats: 5 }, () => {
  const { expected, requests } = mockUtils.request.get(
    `/certification/tv/list`,
    null,
    certificationsSchema
  );

  it(`sends GET /certification/tv/list and resolves the validated response`, async () => {
    await expect(
      toValidated(getTvCertifications, null, certificationsSchema)()
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/certification/tv/list`);
  });
});

describe(`certificationsSchema`, () => {
  // Real responses (fixtures/certification-tv-list) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`certification-tv-list`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(certificationsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
