import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _certificationSchema = v.object({
  /** The rating itself, e.g. `PG-13`. */
  certification: v.string(),
  /** What the rating means, or `""`. */
  meaning: v.string(),
  /** Rank within the country, lowest (least restrictive) first. */
  order: integer
});

export interface Certification extends v.InferOutput<
  typeof _certificationSchema
> {}

const _certificationsSchema = v.object({
  /** Keyed by ISO 3166-1 country code (and some subdivisions, e.g. `CA-QC`). */
  certifications: v.record(
    v.string(),
    v.array(schema<Certification>(_certificationSchema))
  )
});

export interface Certifications extends v.InferOutput<
  typeof _certificationsSchema
> {}

/**
 * ### Certifications
 *
 * The content ratings each country uses for movies or TV (`getMovieCertifications`, `getTvCertifications`).
 */
export const certificationsSchema = schema<Certifications>(
  _certificationsSchema
);
