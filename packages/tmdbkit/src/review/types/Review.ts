import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { pageEntries } from "../../types/PagedResults.js";

export const reviewEntries = {
  id: v.string(),
  author: v.string(),
  authorDetails: v.object({
    /** `""` when the author hasn't set one. */
    name: v.string(),
    username: v.string(),
    avatarPath: v.nullable(v.string()),
    /** Out of 10, or `null` when the review has no rating. */
    rating: v.nullable(v.number())
  }),
  content: v.string(),
  /** ISO 8601 timestamp. */
  createdAt: v.string(),
  updatedAt: v.string(),
  url: v.string()
} as const;

const _reviewSchema = v.object(reviewEntries);

export interface Review extends v.InferOutput<typeof _reviewSchema> {}

/**
 * ### Review
 *
 * A user review of a movie or TV series.
 */
export const reviewSchema = schema<Review>(_reviewSchema);

const _reviewsSchema = v.object({
  id: integer,
  ...pageEntries,
  results: v.array(reviewSchema)
});

export interface Reviews extends v.InferOutput<typeof _reviewsSchema> {}

/** A page of a movie's or TV series' reviews (`getMovieReviews`, `getTvSeriesReviews`). */
export const reviewsSchema = schema<Reviews>(_reviewsSchema);

const _reviewDetailsSchema = v.object({
  ...reviewEntries,
  iso_639_1: v.string(),
  mediaId: integer,
  mediaTitle: v.string(),
  /** `movie` or `tv`. */
  mediaType: v.string()
});

export interface ReviewDetails extends v.InferOutput<
  typeof _reviewDetailsSchema
> {}

/** One review with the title it's about (`getReview`). */
export const reviewDetailsSchema = schema<ReviewDetails>(_reviewDetailsSchema);
