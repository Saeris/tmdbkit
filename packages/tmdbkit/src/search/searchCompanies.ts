import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedCompanyResults } from "../company/types/CompanyListItem.js";

export const searchCompaniesSchema = v.object({
  query: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        page: integer
      })
    )
  )
});

/**
 * ### [Company](https://developer.themoviedb.org/reference/search-company)
 *
 * **GET** `/search/company`
 */
export const searchCompanies: Fetcher<
  typeof searchCompaniesSchema,
  PagedCompanyResults
> = async ({ query, params }, options) =>
  get(`/search/company`, { ...params, query }, options);
