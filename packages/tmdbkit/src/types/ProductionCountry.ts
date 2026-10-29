import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const productionCountryEntries = {
  /** ISO 3166-1 code. */
  iso_3166_1: v.string(),
  name: v.string()
} as const;

const _productionCountrySchema = v.object(productionCountryEntries);

export interface ProductionCountry extends v.InferOutput<
  typeof _productionCountrySchema
> {}

/**
 * ### Production Country
 *
 * A country a movie or TV series was produced in.
 */
export const productionCountrySchema = schema<ProductionCountry>(
  _productionCountrySchema
);
