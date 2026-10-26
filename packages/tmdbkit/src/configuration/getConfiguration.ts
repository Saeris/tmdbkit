import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { Configuration } from "../types/Configuration.js";

export const getConfigurationSchema = v.object({});

/**
 * ### [Get Configuration](https://developer.themoviedb.org/reference/configuration-get)
 *
 * **GET** `/configuration`
 *
 * Get the configuration information for your API calls.
 */
export const getConfiguration: Fetcher<
  typeof getConfigurationSchema,
  Configuration
> = async () => get(`/configuration`);
