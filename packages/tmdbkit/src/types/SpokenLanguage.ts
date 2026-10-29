import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const spokenLanguageEntries = {
  englishName: v.string(),
  /** ISO 639-1 code. */
  iso_639_1: v.string(),
  /** The language's name in itself, or `""` when TMDB doesn't have one. */
  name: v.string()
} as const;

const _spokenLanguageSchema = v.object(spokenLanguageEntries);

export interface SpokenLanguage extends v.InferOutput<
  typeof _spokenLanguageSchema
> {}

/**
 * ### Spoken Language
 *
 * A language spoken in a movie or TV series. `getLanguages` returns the same shape.
 */
export const spokenLanguageSchema = schema<SpokenLanguage>(
  _spokenLanguageSchema
);
