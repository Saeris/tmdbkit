import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { keywordSchema } from "../../types/Keyword.js";

const _movieKeywordsSchema = v.object({
  id: integer,
  keywords: v.array(keywordSchema)
});

export interface MovieKeywords extends v.InferOutput<
  typeof _movieKeywordsSchema
> {}

/**
 * ### Movie Keywords
 *
 * The keywords a movie is tagged with (`getMovieKeywords`). TV keywords come back under `results` instead (see `TvKeywords`).
 */
export const movieKeywordsSchema = schema<MovieKeywords>(_movieKeywordsSchema);
