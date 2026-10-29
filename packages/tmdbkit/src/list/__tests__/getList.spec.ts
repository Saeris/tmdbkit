import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getList, getListSchema } from "../getList.js";
import { listDetailsSchema } from "../types/ListDetails.js";

describe(`getList`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/list/:listId`,
    getListSchema,
    listDetailsSchema
  );

  it(`sends GET /list/{list_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(getList, getListSchema, listDetailsSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/list/${config.listId}`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`listDetailsSchema`, () => {
  // Real responses (fixtures/list-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`list-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(listDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
