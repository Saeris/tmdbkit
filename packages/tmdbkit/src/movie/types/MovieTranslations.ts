import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { translations, type Translations } from "../../types/Translation.js";

const _movieTranslationDataSchema = v.object({
  title: v.string(),
  overview: v.string(),
  tagline: v.string(),
  homepage: v.string(),
  /** Minutes; `0` when the translation doesn't set it. */
  runtime: v.nullable(integer)
});

export interface MovieTranslationData extends v.InferOutput<
  typeof _movieTranslationDataSchema
> {}

export interface MovieTranslations extends Translations<MovieTranslationData> {}

/**
 * ### Movie Translations
 *
 * A movie's title, overview, tagline, homepage and runtime in each language TMDB has them in (`getMovieTranslations`). Untranslated fields are `""`.
 */
export const movieTranslationsSchema = schema<MovieTranslations>(
  translations(_movieTranslationDataSchema)
);
