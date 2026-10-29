import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { translations, type Translations } from "../../types/Translation.js";

const _tvTranslationDataSchema = v.object({
  name: v.string(),
  overview: v.string(),
  homepage: v.string(),
  tagline: v.string()
});

export interface TvTranslationData extends v.InferOutput<
  typeof _tvTranslationDataSchema
> {}

export interface TvTranslations extends Translations<TvTranslationData> {}

/**
 * ### TV Translations
 *
 * A TV series' name, overview, homepage and tagline in each language TMDB has them in (`getTvSeriesTranslations`). Untranslated fields are `""`.
 */
export const tvTranslationsSchema = schema<TvTranslations>(
  translations(_tvTranslationDataSchema)
);

const _nameOverviewDataSchema = v.object({
  name: v.string(),
  overview: v.string()
});

export interface NameOverviewData extends v.InferOutput<
  typeof _nameOverviewDataSchema
> {}

export interface NameOverviewTranslations extends Translations<NameOverviewData> {}

/** A season's or episode's name and overview in each language (`getTvSeasonTranslations`, `getTvEpisodeTranslations`). */
export const nameOverviewTranslationsSchema = schema<NameOverviewTranslations>(
  translations(_nameOverviewDataSchema)
);
