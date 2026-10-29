import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const changeItemEntries = {
  id: v.string(),
  /** `added`, `updated`, `deleted`, `created`, … */
  action: v.string(),
  /** When the change was made, e.g. `2026-10-27 19:04:12 UTC`. */
  time: v.string(),
  /** Language the change applies to, or `""`. */
  iso_639_1: v.exactOptional(v.string()),
  /** Region the change applies to, or `""`. */
  iso_3166_1: v.exactOptional(v.string()),
  /** The new value. Its shape depends on the change's `key` (a string for `overview`, an object for `cast`, …), so it is left `unknown`. */
  value: v.exactOptional(v.unknown()),
  /** The previous value, present on updates and deletes; shaped like `value`. */
  originalValue: v.exactOptional(v.unknown())
} as const;

const _changesSchema = v.object({
  changes: v.array(
    v.object({
      /** The field that changed, e.g. `overview`, `cast`, `images`. */
      key: v.string(),
      items: v.array(v.object(changeItemEntries))
    })
  )
});

export interface Changes extends v.InferOutput<typeof _changesSchema> {}

/**
 * ### Changes
 *
 * The edits made to one movie, TV series, season, episode or person over the requested window (up to 14 days; the last 24 hours by default).
 */
export const changesSchema = schema<Changes>(_changesSchema);
