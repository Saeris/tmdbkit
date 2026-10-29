import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { keywordSchema } from "../../types/Keyword.js";

const _tvKeywordsSchema = v.object({
  id: integer,
  results: v.array(keywordSchema)
});

export interface TvKeywords extends v.InferOutput<typeof _tvKeywordsSchema> {}

/**
 * ### TV Keywords
 *
 * The keywords a TV series is tagged with (`getTvSeriesKeywords`). Movie keywords come back under `keywords` instead (see `MovieKeywords`).
 */
export const tvKeywordsSchema = schema<TvKeywords>(_tvKeywordsSchema);
