import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _companyDetailsSchema = v.object({
  /** `""` when TMDB has none. */
  description: v.string(),
  headquarters: v.string(),
  homepage: v.nullable(v.string()),
  id: integer,
  logoPath: v.nullable(v.string()),
  name: v.string(),
  /** ISO 3166-1 code, or `""`. */
  originCountry: v.string(),
  /** The parent company's id. Recorded as an id for Lucasfilm (2026-10-28); `null` for companies without one is assumed, not observed. */
  parentCompany: v.nullable(integer)
});

export interface CompanyDetails extends v.InferOutput<
  typeof _companyDetailsSchema
> {}

/**
 * ### Company
 *
 * A production company (`getCompany`).
 */
export const companyDetailsSchema = schema<CompanyDetails>(
  _companyDetailsSchema
);
