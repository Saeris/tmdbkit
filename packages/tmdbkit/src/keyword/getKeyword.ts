import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { Keyword } from "../types/Keyword.js";

export const getKeywordSchema = v.object({
  keywordId: tmdbId
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/keyword-details)
 *
 * **GET** `/keyword/{keyword_id}`
 */
export const getKeyword: Fetcher<typeof getKeywordSchema, Keyword> = async (
  { keywordId },
  options
) => get(`/keyword/${keywordId}`, undefined, options);
