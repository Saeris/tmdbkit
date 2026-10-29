import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesReviews,
  getTvSeriesReviewsSchema
} from "../getTvSeriesReviews.js";
import { reviewsSchema } from "../../review/types/Review.js";

describe(`getTvSeriesReviews`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/reviews`,
    getTvSeriesReviewsSchema,
    reviewsSchema
  );

  it(`sends GET /tv/{series_id}/reviews and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesReviews,
        getTvSeriesReviewsSchema,
        reviewsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/reviews`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`reviewsSchema`, () => {
  // Real responses (fixtures/tv-reviews) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-reviews`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(reviewsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
