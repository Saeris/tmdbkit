import * as v from "valibot";
import { schema } from "../validations/schema.js";
import { integer } from "../validations/integer.js";
import { pagedResults, type PagedResults } from "./PagedResults.js";

export const keywordEntries = {
  id: integer,
  name: v.string()
} as const;

const _keywordSchema = v.object(keywordEntries);

export interface Keyword extends v.InferOutput<typeof _keywordSchema> {}

/**
 * ### Keyword
 *
 * A keyword (tag) attached to movies and TV series, as returned by `getKeyword` and inside keyword lists.
 */
export const keywordSchema = schema<Keyword>(_keywordSchema);

export interface PagedKeywordResults extends PagedResults<Keyword> {}

/** A page of {@link Keyword}s (`searchKeywords`). */
export const pagedKeywordResultsSchema = schema<PagedKeywordResults>(
  pagedResults(keywordSchema)
);
