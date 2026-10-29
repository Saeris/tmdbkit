import { get, type Fetcher } from "../requests/methods.js";
import type { PersonDetails } from "./types/PersonDetails.js";

/**
 * ### [Latest](https://developer.themoviedb.org/reference/person-latest-id)
 *
 * **GET** `/person/latest`
 */
export const getLatestPerson: Fetcher<null, PersonDetails> = async (options) =>
  get(`/person/latest`, undefined, options);
