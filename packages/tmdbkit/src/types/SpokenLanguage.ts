import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const spokenLanguageEntries = {
  /** the English name of the language */
  englishName: v.string(),
  /** the ISO 639-1 code for the language */
  iso6391: v.string(),
  /** the native name of the language */
  name: v.string()
} as const;

const _spokenLanguageSchema = v.object(spokenLanguageEntries);

export interface SpokenLanguage extends v.InferOutput<
  typeof _spokenLanguageSchema
> {}

/**
 * ### [Spoken Language](https://www.themoviedb.org/documentation/api/spoken-languages)
 *
 * A language spoken in a movie or TV show.
 */
export const spokenLanguageSchema = schema<SpokenLanguage>(
  _spokenLanguageSchema
);
