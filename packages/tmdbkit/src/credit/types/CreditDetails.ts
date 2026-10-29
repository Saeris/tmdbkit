import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { movieMediaListItemEntries } from "../../movie/types/MovieListItem.js";
import { tvMediaListItemEntries } from "../../tv/types/TvListItem.js";
import { personMediaListItemSchema } from "../../person/types/PersonListItem.js";

const _creditDetailsSchema = v.object({
  /** The credit id that cast and crew entries carry as `creditId`. */
  id: v.string(),
  /** `cast` or `crew`. */
  creditType: v.string(),
  department: v.string(),
  job: v.string(),
  mediaType: v.string(),
  /** The title the credit is on. Only a movie credit was recorded (2026-10-28); the TV branch's `episodes`/`seasons` are typed loosely until one is. */
  media: v.variant(`mediaType`, [
    v.object({
      ...movieMediaListItemEntries,
      character: v.exactOptional(v.string())
    }),
    v.object({
      ...tvMediaListItemEntries,
      character: v.exactOptional(v.string()),
      episodes: v.exactOptional(v.array(v.unknown())),
      seasons: v.exactOptional(v.array(v.unknown()))
    })
  ]),
  person: personMediaListItemSchema
});

export interface CreditDetails extends v.InferOutput<
  typeof _creditDetailsSchema
> {}

/**
 * ### Credit
 *
 * One cast or crew credit, with the person and the title it joins (`getCredit`).
 */
export const creditDetailsSchema = schema<CreditDetails>(_creditDetailsSchema);
