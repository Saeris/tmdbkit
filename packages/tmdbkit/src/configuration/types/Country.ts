import * as v from "valibot";
import { schema } from "../../validations/schema.js";

export const countryEntries = {
  /** ISO 3166-1 code. */
  iso_3166_1: v.string(),
  englishName: v.string(),
  /** The country's name in the requested `language`. */
  nativeName: v.string()
} as const;

const _countrySchema = v.object(countryEntries);

export interface Country extends v.InferOutput<typeof _countrySchema> {}

/**
 * ### Country
 *
 * A country TMDB knows of. Watch-provider regions share this shape.
 */
export const countrySchema = schema<Country>(_countrySchema);

export type Countries = Country[];

/** Every country TMDB uses (`getCountries`). */
export const countriesSchema = schema<Countries>(v.array(countrySchema));
