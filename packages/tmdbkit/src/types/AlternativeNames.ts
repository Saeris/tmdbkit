import * as v from "valibot";
import { schema } from "../validations/schema.js";
import { integer } from "../validations/integer.js";

const _alternativeNamesSchema = v.object({
  id: integer,
  results: v.array(
    v.object({
      name: v.string(),
      /** What the name is (e.g. a former name), or `""`. */
      type: v.string()
    })
  )
});

export interface AlternativeNames extends v.InferOutput<
  typeof _alternativeNamesSchema
> {}

/**
 * ### Alternative Names
 *
 * Other names a company or network is known by (`getCompanyAlternativeNames`, `getNetworkAlternativeNames`).
 */
export const alternativeNamesSchema = schema<AlternativeNames>(
  _alternativeNamesSchema
);
