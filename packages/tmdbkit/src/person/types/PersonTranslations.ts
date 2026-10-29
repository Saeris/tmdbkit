import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { translations, type Translations } from "../../types/Translation.js";

const _personTranslationDataSchema = v.object({
  name: v.string(),
  biography: v.string(),
  /** Whether this is the person's primary language. */
  primary: v.boolean()
});

export interface PersonTranslationData extends v.InferOutput<
  typeof _personTranslationDataSchema
> {}

export interface PersonTranslations extends Translations<PersonTranslationData> {}

/**
 * ### Person Translations
 *
 * A person's name and biography in each language TMDB has them in (`getPersonTranslations`). Untranslated fields are `""`.
 */
export const personTranslationsSchema = schema<PersonTranslations>(
  translations(_personTranslationDataSchema)
);
