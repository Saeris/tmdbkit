import * as v from "valibot";

/**
 * A generic wrapper for paged list responses from the TMDB API.
 *
 * Most list and search endpoints return `{ page, results, total_pages, total_results }`.
 *
 * @typeParam T - the schema for each item in the `results` array
 */
export const pagedResults = <T extends v.GenericSchema>(
  itemSchema: T
): v.GenericSchema<PagedResults<v.InferOutput<T>>> =>
  v.object({
    /** the current page */
    page: v.number(),
    /** the list of results for the current page */
    results: v.array(itemSchema),
    /** the total number of pages */
    totalPages: v.number(),
    /** the total number of results */
    totalResults: v.number()
  });

/**
 * The inferred output type for a paged results wrapper.
 *
 * @typeParam T - the type of each item in the `results` array
 */
export interface PagedResults<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}
