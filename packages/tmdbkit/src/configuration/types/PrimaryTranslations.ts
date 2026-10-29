import * as v from "valibot";
import { schema } from "../../validations/schema.js";

export type PrimaryTranslations = string[];

/**
 * ### Primary Translations
 *
 * The languages TMDB translates its content into, as `language-REGION` tags (e.g. `en-US`, `pt-BR`): the values worth passing as a request's `language`.
 */
export const primaryTranslationsSchema = schema<PrimaryTranslations>(
  v.array(v.string())
);
