import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getCollectionImages,
  getCollectionImagesSchema
} from "../getCollectionImages.js";
import { mediaImagesSchema } from "../../types/Images.js";

describe(`getCollectionImages`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/collection/:collectionId/images`,
    getCollectionImagesSchema,
    mediaImagesSchema
  );

  it(`sends GET /collection/{collection_id}/images and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getCollectionImages,
        getCollectionImagesSchema,
        mediaImagesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/collection/${config.collectionId}/images`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`mediaImagesSchema`, () => {
  // Real responses (fixtures/collection-images) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`collection-images`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(mediaImagesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
