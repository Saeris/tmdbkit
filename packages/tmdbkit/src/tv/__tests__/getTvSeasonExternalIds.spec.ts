import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeasonExternalIds,
  getTvSeasonExternalIdsSchema
} from "../getTvSeasonExternalIds.js";
import { tvSeasonExternalIdsSchema } from "../types/TvExternalIds.js";

describe(`getTvSeasonExternalIds`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber/external_ids`,
    getTvSeasonExternalIdsSchema,
    tvSeasonExternalIdsSchema
  );

  it(`sends GET /tv/{series_id}/season/{season_number}/external_ids and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeasonExternalIds,
        getTvSeasonExternalIdsSchema,
        tvSeasonExternalIdsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/season/${config.seasonNumber}/external_ids`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`tvSeasonExternalIdsSchema`, () => {
  // Real responses (fixtures/tv-season-external-ids) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-season-external-ids`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(tvSeasonExternalIdsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
