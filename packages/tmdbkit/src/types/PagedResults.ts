import * as v from "valibot";
import { integer } from "../validations/integer.js";

/** The paging fields TMDB puts beside `results` on every list endpoint. */
export const pageEntries = {
  /** The page returned, from 1. */
  page: integer,
  totalPages: integer,
  totalResults: integer
} as const;

/**
 * A page of results: `{ page, results, total_pages, total_results }`, the shape of every TMDB list, search and discover response.
 *
 * @typeParam T - the schema for each item in the `results` array
 */
export const pagedResults = <T extends v.GenericSchema>(
  itemSchema: T
): v.GenericSchema<PagedResults<v.InferOutput<T>>> =>
  v.object({ ...pageEntries, results: v.array(itemSchema) });

/**
 * The type of a {@link pagedResults} page.
 *
 * @typeParam T - the type of each item in the `results` array
 */
export interface PagedResults<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}
