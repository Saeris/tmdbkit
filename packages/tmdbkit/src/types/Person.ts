import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const personEntries = {
  /** whether the person is an adult */
  adult: v.boolean(),
  /** the alternative names the person is also known as */
  alsoKnownAs: v.array(v.string()),
  /** the biography of the person */
  biography: v.nullish(v.string()),
  /** the birthday of the person */
  birthday: v.nullish(v.string()),
  /** the deathday of the person */
  deathday: v.nullish(v.string()),
  /** the gender of the person (0 unknown, 1 female, 2 male, 3 non-binary) */
  gender: v.number(),
  /** the homepage of the person */
  homepage: v.nullish(v.string()),
  /** the person id */
  id: v.number(),
  /** the IMDB id for the person */
  imdbId: v.nullish(v.string()),
  /** the department the person is known for */
  knownForDepartment: v.nullish(v.string()),
  /** the name of the person */
  name: v.string(),
  /** the place of birth of the person */
  placeOfBirth: v.nullish(v.string()),
  /** the popularity of the person */
  popularity: v.number(),
  /** the path of the person profile image */
  profilePath: v.nullish(v.string())
} as const;

const _personSchema = v.object(personEntries);

export interface Person extends v.InferOutput<typeof _personSchema> {}

/**
 * ### [Person](https://www.themoviedb.org/documentation/api/persons)
 *
 * A person (actor, director, crew member, etc.) associated with a movie or TV show.
 */
export const personSchema = schema<Person>(_personSchema);
