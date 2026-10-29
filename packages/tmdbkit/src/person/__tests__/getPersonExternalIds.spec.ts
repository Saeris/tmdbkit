import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getPersonExternalIds,
  getPersonExternalIdsSchema
} from "../getPersonExternalIds.js";
import { personExternalIdsSchema } from "../types/PersonExternalIds.js";

describe(`getPersonExternalIds`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/person/:personId/external_ids`,
    getPersonExternalIdsSchema,
    personExternalIdsSchema
  );

  it(`sends GET /person/{person_id}/external_ids and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPersonExternalIds,
        getPersonExternalIdsSchema,
        personExternalIdsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/person/${config.personId}/external_ids`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`personExternalIdsSchema`, () => {
  // Real responses (fixtures/person-external-ids) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`person-external-ids`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(personExternalIdsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
