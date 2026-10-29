import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getPersonImages, getPersonImagesSchema } from "../getPersonImages.js";
import { profileImagesSchema } from "../../types/Images.js";

describe(`getPersonImages`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/person/:personId/images`,
    getPersonImagesSchema,
    profileImagesSchema
  );

  it(`sends GET /person/{person_id}/images and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPersonImages,
        getPersonImagesSchema,
        profileImagesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/person/${config.personId}/images`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`profileImagesSchema`, () => {
  // Real responses (fixtures/person-images) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`person-images`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(profileImagesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
