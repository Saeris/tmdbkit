import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import {
  spokenLanguageSchema,
  type SpokenLanguage
} from "../../types/SpokenLanguage.js";

export type Languages = SpokenLanguage[];

/**
 * ### Languages
 *
 * Every language TMDB uses (`getLanguages`), in the same shape as a title's spoken languages.
 */
export const languagesSchema = schema<Languages>(v.array(spokenLanguageSchema));
