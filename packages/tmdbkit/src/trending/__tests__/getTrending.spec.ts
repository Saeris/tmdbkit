import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getTrending, getTrendingSchema } from "../getTrending.js";
import { pagedMediaResultsSchema } from "../../types/MediaListItem.js";

describe(`getTrending`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/trending/all/:timeWindow`,
    getTrendingSchema,
    pagedMediaResultsSchema
  );

  it(`sends GET /trending/all/{time_window} and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTrending,
        getTrendingSchema,
        pagedMediaResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/trending/all/${config.timeWindow}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedMediaResultsSchema`, () => {
  // Real responses (fixtures/trending-all) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`trending-all`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedMediaResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
