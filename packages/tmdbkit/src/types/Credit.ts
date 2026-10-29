import * as v from "valibot";
import { schema } from "../validations/schema.js";
import { integer } from "../validations/integer.js";

/** The person fields every cast and crew credit carries. */
export const creditPersonEntries = {
  adult: v.boolean(),
  /** TMDB's gender code (`0` when not set). */
  gender: integer,
  id: integer,
  knownForDepartment: v.string(),
  name: v.string(),
  originalName: v.string(),
  popularity: v.number(),
  profilePath: v.nullable(v.string())
} as const;

export const castCreditEntries = {
  ...creditPersonEntries,
  /** The role played, or `""` when unknown. */
  character: v.string(),
  creditId: v.string(),
  /** Billing order, starting at 0. */
  order: integer
} as const;

const _castCreditSchema = v.object(castCreditEntries);

export interface CastCredit extends v.InferOutput<typeof _castCreditSchema> {}

/**
 * ### Cast Credit
 *
 * A person cast in a TV series, season or episode. Movie cast adds `castId` (see `MovieCastCredit`).
 */
export const castCreditSchema = schema<CastCredit>(_castCreditSchema);

export const crewCreditEntries = {
  ...creditPersonEntries,
  creditId: v.string(),
  department: v.string(),
  job: v.string()
} as const;

const _crewCreditSchema = v.object(crewCreditEntries);

export interface CrewCredit extends v.InferOutput<typeof _crewCreditSchema> {}

/**
 * ### Crew Credit
 *
 * A person credited for a job (director, writer, …) on a movie, TV series, season or episode.
 */
export const crewCreditSchema = schema<CrewCredit>(_crewCreditSchema);
