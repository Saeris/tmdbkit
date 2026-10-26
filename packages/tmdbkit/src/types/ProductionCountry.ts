import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const productionCountryEntries = {
  /** the ISO 3166-1 code for the country */
  iso31661: v.string(),
  /** the name of the country */
  name: v.string()
} as const;

const _productionCountrySchema = v.object(productionCountryEntries);

export interface ProductionCountry extends v.InferOutput<
  typeof _productionCountrySchema
> {}

/**
 * ### [Production Country](https://www.themoviedb.org/documentation/api/production-countries)
 *
 * A country where a movie or TV show was produced.
 */
export const productionCountrySchema = schema<ProductionCountry>(
  _productionCountrySchema
);
