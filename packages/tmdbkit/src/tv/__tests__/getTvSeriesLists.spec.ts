import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesLists,
  getTvSeriesListsSchema
} from "../getTvSeriesLists.js";
import { listsContainingSchema } from "../../list/types/ListsContaining.js";

describe(`getTvSeriesLists`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/lists`,
    getTvSeriesListsSchema,
    listsContainingSchema
  );

  it(`sends GET /tv/{series_id}/lists and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesLists,
        getTvSeriesListsSchema,
        listsContainingSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/lists`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`listsContainingSchema`, () => {
  // Real responses (fixtures/tv-lists) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-lists`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(listsContainingSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
