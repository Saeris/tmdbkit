import * as v from "valibot";
import { schema } from "../validations/schema.js";
import { integer } from "../validations/integer.js";

export const productionCompanyEntries = {
  id: integer,
  logoPath: v.nullable(v.string()),
  name: v.string(),
  /** ISO 3166-1 code, or `""` when TMDB doesn't know it. */
  originCountry: v.string()
} as const;

const _productionCompanySchema = v.object(productionCompanyEntries);

export interface ProductionCompany extends v.InferOutput<
  typeof _productionCompanySchema
> {}

/**
 * ### Production Company
 *
 * A company credited on a movie or TV series. TV networks share this shape.
 */
export const productionCompanySchema = schema<ProductionCompany>(
  _productionCompanySchema
);
