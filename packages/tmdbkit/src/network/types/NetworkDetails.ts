import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _networkDetailsSchema = v.object({
  headquarters: v.string(),
  homepage: v.nullable(v.string()),
  id: integer,
  logoPath: v.nullable(v.string()),
  name: v.string(),
  /** ISO 3166-1 code, or `""`. */
  originCountry: v.string()
});

export interface NetworkDetails extends v.InferOutput<
  typeof _networkDetailsSchema
> {}

/**
 * ### Network
 *
 * A TV network (`getNetwork`). TV series list theirs under `networks`.
 */
export const networkDetailsSchema = schema<NetworkDetails>(
  _networkDetailsSchema
);
