import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getReview, getReviewSchema } from "../getReview.js";
import { reviewDetailsSchema } from "../types/Review.js";

describe(`getReview`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/review/:reviewId`,
    getReviewSchema,
    reviewDetailsSchema
  );

  it(`sends GET /review/{review_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(getReview, getReviewSchema, reviewDetailsSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/review/${config.reviewId}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`reviewDetailsSchema`, () => {
  // Real responses (fixtures/review-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`review-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(reviewDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
