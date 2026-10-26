import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const crewMemberEntries = {
  /** the department the crew member worked in */
  department: v.string(),
  /** the job the crew member performed */
  job: v.string(),
  /** the credit id */
  creditId: v.nullish(v.string()),
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

const _crewMemberSchema = v.object(crewMemberEntries);

export interface CrewMember extends v.InferOutput<typeof _crewMemberSchema> {}

/**
 * ### [Crew Member](https://www.themoviedb.org/documentation/api/credits)
 *
 * A crew member (director, writer, etc.) credited on a movie, TV show, or episode.
 */
export const crewMemberSchema = schema<CrewMember>(_crewMemberSchema);
