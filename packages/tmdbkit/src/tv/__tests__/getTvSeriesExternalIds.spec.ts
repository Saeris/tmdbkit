import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesExternalIds,
  getTvSeriesExternalIdsSchema
} from "../getTvSeriesExternalIds.js";
import { tvSeriesExternalIdsSchema } from "../types/TvExternalIds.js";

describe(`getTvSeriesExternalIds`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/external_ids`,
    getTvSeriesExternalIdsSchema,
    tvSeriesExternalIdsSchema
  );

  it(`sends GET /tv/{series_id}/external_ids and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesExternalIds,
        getTvSeriesExternalIdsSchema,
        tvSeriesExternalIdsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/external_ids`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`tvSeriesExternalIdsSchema`, () => {
  // Real responses (fixtures/tv-external-ids) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-external-ids`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(tvSeriesExternalIdsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
