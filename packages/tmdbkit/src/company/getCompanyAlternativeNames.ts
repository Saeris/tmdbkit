import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { AlternativeNames } from "../types/AlternativeNames.js";

export const getCompanyAlternativeNamesSchema = v.object({
  companyId: tmdbId
});

/**
 * ### [Alternative Names](https://developer.themoviedb.org/reference/company-alternative-names)
 *
 * **GET** `/company/{company_id}/alternative_names`
 */
export const getCompanyAlternativeNames: Fetcher<
  typeof getCompanyAlternativeNamesSchema,
  AlternativeNames
> = async ({ companyId }, options) =>
  get(`/company/${companyId}/alternative_names`, undefined, options);
