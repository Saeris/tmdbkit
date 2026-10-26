import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const productionCompanyEntries = {
  /** the company id */
  id: v.number(),
  /** the path of the company logo */
  logoPath: v.nullish(v.string()),
  /** the name of the company */
  name: v.string(),
  /** the ISO 3166-1 code for the country the company is based in */
  originCountry: v.nullish(v.string())
} as const;

const _productionCompanySchema = v.object(productionCompanyEntries);

export interface ProductionCompany extends v.InferOutput<
  typeof _productionCompanySchema
> {}

/**
 * ### [Production Company](https://www.themoviedb.org/documentation/api/production-companies)
 *
 * A production company that produced a movie or TV show.
 */
export const productionCompanySchema = schema<ProductionCompany>(
  _productionCompanySchema
);
