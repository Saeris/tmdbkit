import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesContentRatings,
  getTvSeriesContentRatingsSchema
} from "../getTvSeriesContentRatings.js";
import { contentRatingsSchema } from "../types/ContentRatings.js";

describe(`getTvSeriesContentRatings`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/content_ratings`,
    getTvSeriesContentRatingsSchema,
    contentRatingsSchema
  );

  it(`sends GET /tv/{series_id}/content_ratings and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesContentRatings,
        getTvSeriesContentRatingsSchema,
        contentRatingsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/content_ratings`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`contentRatingsSchema`, () => {
  // Real responses (fixtures/tv-content-ratings) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-content-ratings`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(contentRatingsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
