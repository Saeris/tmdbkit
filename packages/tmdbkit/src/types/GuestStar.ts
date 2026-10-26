import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const guestStarEntries = {
  /** the character the guest star played */
  character: v.string(),
  /** the credit id */
  creditId: v.nullish(v.string()),
  /** the order the guest star is displayed in */
  order: v.number(),
  /** whether the person is an adult */
  adult: v.boolean(),
  /** the gender of the person */
  gender: v.number(),
  /** the person id */
  id: v.number(),
  /** the department the person is known for */
  knownForDepartment: v.nullish(v.string()),
  /** the name of the person */
  name: v.string(),
  /** the original name of the person */
  originalName: v.nullish(v.string()),
  /** the popularity of the person */
  popularity: v.number(),
  /** the path of the person profile image */
  profilePath: v.nullish(v.string())
} as const;

const _guestStarSchema = v.object(guestStarEntries);

export interface GuestStar extends v.InferOutput<typeof _guestStarSchema> {}

/**
 * ### [Guest Star](https://www.themoviedb.org/documentation/api/credits)
 *
 * A guest star appearing in a TV episode.
 */
export const guestStarSchema = schema<GuestStar>(_guestStarSchema);
