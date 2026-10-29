import * as v from "valibot";
import { schema } from "../../validations/schema.js";

const _timezoneSchema = v.object({
  /** ISO 3166-1 code. */
  iso_3166_1: v.string(),
  /** IANA zone names, e.g. `America/Los_Angeles`. */
  zones: v.array(v.string())
});

export interface Timezone extends v.InferOutput<typeof _timezoneSchema> {}

export type Timezones = Timezone[];

/**
 * ### Timezones
 *
 * The time zones of every country (`getTimezones`), as used by `getTvSeriesAiringToday`'s `timezone`.
 */
export const timezonesSchema = schema<Timezones>(
  v.array(schema<Timezone>(_timezoneSchema))
);
