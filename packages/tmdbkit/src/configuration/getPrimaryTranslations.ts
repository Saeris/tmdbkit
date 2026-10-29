import { get, type Fetcher } from "../requests/methods.js";
import type { PrimaryTranslations } from "./types/PrimaryTranslations.js";

/**
 * ### [Primary Translations](https://developer.themoviedb.org/reference/configuration-primary-translations)
 *
 * **GET** `/configuration/primary_translations`
 */
export const getPrimaryTranslations: Fetcher<
  null,
  PrimaryTranslations
> = async (options) =>
  get(`/configuration/primary_translations`, undefined, options);
