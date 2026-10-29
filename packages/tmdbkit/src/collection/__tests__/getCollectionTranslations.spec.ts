import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getCollectionTranslations,
  getCollectionTranslationsSchema
} from "../getCollectionTranslations.js";
import { collectionTranslationsSchema } from "../types/CollectionTranslations.js";

describe(`getCollectionTranslations`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/collection/:collectionId/translations`,
    getCollectionTranslationsSchema,
    collectionTranslationsSchema
  );

  it(`sends GET /collection/{collection_id}/translations and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getCollectionTranslations,
        getCollectionTranslationsSchema,
        collectionTranslationsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/collection/${config.collectionId}/translations`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`collectionTranslationsSchema`, () => {
  // Real responses (fixtures/collection-translations) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`collection-translations`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(collectionTranslationsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
