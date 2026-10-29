import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getPersonChanges,
  getPersonChangesSchema
} from "../getPersonChanges.js";
import { changesSchema } from "../../types/Changes.js";

describe(`getPersonChanges`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/person/:personId/changes`,
    getPersonChangesSchema,
    changesSchema
  );

  it(`sends GET /person/{person_id}/changes and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPersonChanges,
        getPersonChangesSchema,
        changesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/person/${config.personId}/changes`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`changesSchema`, () => {
  // Real responses (fixtures/person-changes) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`person-changes`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(changesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
