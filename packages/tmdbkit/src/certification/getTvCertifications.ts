import { get, type Fetcher } from "../requests/methods.js";
import type { Certifications } from "./types/Certifications.js";

/**
 * ### [TV Certifications](https://developer.themoviedb.org/reference/certifications-tv-list)
 *
 * **GET** `/certification/tv/list`
 */
export const getTvCertifications: Fetcher<null, Certifications> = async (
  options
) => get(`/certification/tv/list`, undefined, options);
