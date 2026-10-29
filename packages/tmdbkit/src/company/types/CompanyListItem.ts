import { schema } from "../../validations/schema.js";
import { pagedResults, type PagedResults } from "../../types/PagedResults.js";
import {
  productionCompanySchema,
  type ProductionCompany
} from "../../types/ProductionCompany.js";

export interface PagedCompanyResults extends PagedResults<ProductionCompany> {}

/**
 * ### Company Search Results
 *
 * A page of companies (`searchCompanies`), each in the same shape a title's production companies have.
 */
export const pagedCompanyResultsSchema = schema<PagedCompanyResults>(
  pagedResults(productionCompanySchema)
);
