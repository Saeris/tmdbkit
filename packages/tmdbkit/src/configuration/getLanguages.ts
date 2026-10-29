import { get, type Fetcher } from "../requests/methods.js";
import type { Languages } from "./types/Language.js";

/**
 * ### [Languages](https://developer.themoviedb.org/reference/configuration-languages)
 *
 * **GET** `/configuration/languages`
 */
export const getLanguages: Fetcher<null, Languages> = async (options) =>
  get(`/configuration/languages`, undefined, options);
