import { get, type Fetcher } from "../requests/methods.js";
import type { ConfigurationDetails } from "./types/ConfigurationDetails.js";

/**
 * ### [Details](https://developer.themoviedb.org/reference/configuration-details)
 *
 * **GET** `/configuration`
 */
export const getConfiguration: Fetcher<null, ConfigurationDetails> = async (
  options
) => get(`/configuration`, undefined, options);
