import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getListItemStatus,
  getListItemStatusSchema
} from "../getListItemStatus.js";
import { listItemStatusSchema } from "../types/ListItemStatus.js";

describe(`getListItemStatus`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/list/:listId/item_status`,
    getListItemStatusSchema,
    listItemStatusSchema
  );

  it(`sends GET /list/{list_id}/item_status and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getListItemStatus,
        getListItemStatusSchema,
        listItemStatusSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/list/${config.listId}/item_status`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`listItemStatusSchema`, () => {
  // Real responses (fixtures/list-item-status) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`list-item-status`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(listItemStatusSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
