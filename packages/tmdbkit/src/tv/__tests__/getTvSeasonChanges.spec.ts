import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeasonChanges,
  getTvSeasonChangesSchema
} from "../getTvSeasonChanges.js";
import { changesSchema } from "../../types/Changes.js";

describe(`getTvSeasonChanges`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/season/:seasonId/changes`,
    getTvSeasonChangesSchema,
    changesSchema
  );

  it(`sends GET /tv/season/{season_id}/changes and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeasonChanges,
        getTvSeasonChangesSchema,
        changesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/season/${config.seasonId}/changes`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`changesSchema`, () => {
  // Real responses (fixtures/tv-season-changes) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-season-changes`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(changesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
