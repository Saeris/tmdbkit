import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  findByExternalId,
  findByExternalIdSchema
} from "../findByExternalId.js";
import { findResultsSchema } from "../types/FindResults.js";

describe(`findByExternalId`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/find/:externalId`,
    findByExternalIdSchema,
    findResultsSchema
  );

  it(`sends GET /find/{external_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(
        findByExternalId,
        findByExternalIdSchema,
        findResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/find/${config.externalId}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params, externalSource: config.externalSource })
    );
  });
});

describe(`findResultsSchema`, () => {
  // Real responses (fixtures/find) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`find`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(findResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
