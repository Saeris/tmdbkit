import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesScreenedTheatrically,
  getTvSeriesScreenedTheatricallySchema
} from "../getTvSeriesScreenedTheatrically.js";
import { screenedTheatricallySchema } from "../types/ScreenedTheatrically.js";

describe(`getTvSeriesScreenedTheatrically`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/screened_theatrically`,
    getTvSeriesScreenedTheatricallySchema,
    screenedTheatricallySchema
  );

  it(`sends GET /tv/{series_id}/screened_theatrically and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesScreenedTheatrically,
        getTvSeriesScreenedTheatricallySchema,
        screenedTheatricallySchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/screened_theatrically`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`screenedTheatricallySchema`, () => {
  // Real responses (fixtures/tv-screened-theatrically) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-screened-theatrically`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(screenedTheatricallySchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
