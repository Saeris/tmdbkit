import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { translations, type Translations } from "../../types/Translation.js";

const _collectionTranslationDataSchema = v.object({
  title: v.string(),
  overview: v.string(),
  homepage: v.string()
});

export interface CollectionTranslationData extends v.InferOutput<
  typeof _collectionTranslationDataSchema
> {}

export interface CollectionTranslations extends Translations<CollectionTranslationData> {}

/**
 * ### Collection Translations
 *
 * A collection's title, overview and homepage in each language TMDB has them in (`getCollectionTranslations`). Untranslated fields are `""`.
 */
export const collectionTranslationsSchema = schema<CollectionTranslations>(
  translations(_collectionTranslationDataSchema)
);
