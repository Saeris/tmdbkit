import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { CompanyDetails } from "./types/CompanyDetails.js";

export const getCompanySchema = v.object({
  companyId: tmdbId
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/company-details)
 *
 * **GET** `/company/{company_id}`
 */
export const getCompany: Fetcher<
  typeof getCompanySchema,
  CompanyDetails
> = async ({ companyId }, options) =>
  get(`/company/${companyId}`, undefined, options);
