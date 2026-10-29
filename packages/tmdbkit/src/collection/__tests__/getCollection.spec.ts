import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getCollection, getCollectionSchema } from "../getCollection.js";
import { collectionDetailsSchema } from "../types/CollectionDetails.js";

describe(`getCollection`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/collection/:collectionId`,
    getCollectionSchema,
    collectionDetailsSchema
  );

  it(`sends GET /collection/{collection_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getCollection,
        getCollectionSchema,
        collectionDetailsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/collection/${config.collectionId}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`collectionDetailsSchema`, () => {
  // Real responses (fixtures/collection-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`collection-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(collectionDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
