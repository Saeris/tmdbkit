import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _contentRatingsSchema = v.object({
  id: integer,
  results: v.array(
    v.object({
      /** Content descriptors. TMDB doesn't document their type, and only empty arrays were recorded, so they're left `unknown`. */
      descriptors: v.array(v.unknown()),
      /** ISO 3166-1 code. */
      iso_3166_1: v.string(),
      /** The rating in that region, e.g. `TV-MA`. */
      rating: v.string()
    })
  )
});

export interface ContentRatings extends v.InferOutput<
  typeof _contentRatingsSchema
> {}

/**
 * ### Content Ratings
 *
 * A TV series' rating in each region (`getTvSeriesContentRatings`): the TV counterpart of a movie's release-date certifications.
 */
export const contentRatingsSchema = schema<ContentRatings>(
  _contentRatingsSchema
);
