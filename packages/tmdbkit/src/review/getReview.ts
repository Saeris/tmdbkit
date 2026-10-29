import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { ReviewDetails } from "./types/Review.js";

export const getReviewSchema = v.object({
  reviewId: v.string()
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/review-details)
 *
 * **GET** `/review/{review_id}`
 */
export const getReview: Fetcher<typeof getReviewSchema, ReviewDetails> = async (
  { reviewId },
  options
) => get(`/review/${encodeURIComponent(reviewId)}`, undefined, options);
