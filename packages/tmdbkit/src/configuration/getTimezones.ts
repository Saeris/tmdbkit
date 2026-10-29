import { get, type Fetcher } from "../requests/methods.js";
import type { Timezones } from "./types/Timezone.js";

/**
 * ### [Timezones](https://developer.themoviedb.org/reference/configuration-timezones)
 *
 * **GET** `/configuration/timezones`
 */
export const getTimezones: Fetcher<null, Timezones> = async (options) =>
  get(`/configuration/timezones`, undefined, options);
