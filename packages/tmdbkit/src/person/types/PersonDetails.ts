import * as v from "valibot";
import { omitFields, schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { changesSchema } from "../../types/Changes.js";
import { profileImagesSchema } from "../../types/Images.js";
import {
  personCombinedCreditsSchema,
  personMovieCreditsSchema,
  personTvCreditsSchema
} from "./PersonCredits.js";
import { personExternalIdsSchema } from "./PersonExternalIds.js";
import { personTranslationsSchema } from "./PersonTranslations.js";
import { taggedImagesSchema } from "./TaggedImages.js";

export const personDetailsEntries = {
  adult: v.boolean(),
  /** Other names, often in other scripts. */
  alsoKnownAs: v.array(v.string()),
  /** `""` when TMDB has none. */
  biography: v.string(),
  /** `YYYY-MM-DD`, or `null` when unknown. */
  birthday: v.nullable(v.string()),
  /** `YYYY-MM-DD`, or `null` for the living (and the unknown). */
  deathday: v.nullable(v.string()),
  /** TMDB's gender code (`0` when not set). */
  gender: integer,
  homepage: v.nullable(v.string()),
  id: integer,
  imdbId: v.nullable(v.string()),
  knownForDepartment: v.string(),
  name: v.string(),
  placeOfBirth: v.nullable(v.string()),
  popularity: v.number(),
  profilePath: v.nullable(v.string())
} as const;

/** What `appendToResponse` adds: each key holds the matching endpoint's response without its `id`. */
export const personAppendedEntries = {
  changes: v.exactOptional(changesSchema),
  combinedCredits: v.exactOptional(
    omitFields(personCombinedCreditsSchema, [`id`])
  ),
  externalIds: v.exactOptional(omitFields(personExternalIdsSchema, [`id`])),
  images: v.exactOptional(omitFields(profileImagesSchema, [`id`])),
  movieCredits: v.exactOptional(omitFields(personMovieCreditsSchema, [`id`])),
  taggedImages: v.exactOptional(omitFields(taggedImagesSchema, [`id`])),
  translations: v.exactOptional(omitFields(personTranslationsSchema, [`id`])),
  tvCredits: v.exactOptional(omitFields(personTvCreditsSchema, [`id`]))
} as const;

const _personDetailsSchema = v.object({
  ...personDetailsEntries,
  ...personAppendedEntries
});

export interface PersonDetails extends v.InferOutput<
  typeof _personDetailsSchema
> {}

/**
 * ### Person Details
 *
 * A person (`getPerson`, `getLatestPerson`), plus whatever `appendToResponse` asked for.
 */
export const personDetailsSchema = schema<PersonDetails>(_personDetailsSchema);
