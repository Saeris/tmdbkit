import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getPersonTaggedImages,
  getPersonTaggedImagesSchema
} from "../getPersonTaggedImages.js";
import { taggedImagesSchema } from "../types/TaggedImages.js";

describe(`getPersonTaggedImages`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/person/:personId/tagged_images`,
    getPersonTaggedImagesSchema,
    taggedImagesSchema
  );

  it(`sends GET /person/{person_id}/tagged_images and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPersonTaggedImages,
        getPersonTaggedImagesSchema,
        taggedImagesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/person/${config.personId}/tagged_images`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`taggedImagesSchema`, () => {
  // Real responses (fixtures/person-tagged-images) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`person-tagged-images`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(taggedImagesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
