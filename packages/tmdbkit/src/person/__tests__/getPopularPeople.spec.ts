import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getPopularPeople,
  getPopularPeopleSchema
} from "../getPopularPeople.js";
import { pagedPersonResultsSchema } from "../types/PersonListItem.js";

describe(`getPopularPeople`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/person/popular`,
    getPopularPeopleSchema,
    pagedPersonResultsSchema
  );

  it(`sends GET /person/popular and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPopularPeople,
        getPopularPeopleSchema,
        pagedPersonResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/person/popular`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedPersonResultsSchema`, () => {
  // Real responses (fixtures/person-popular) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`person-popular`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedPersonResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
