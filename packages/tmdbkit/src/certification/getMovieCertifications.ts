import { get, type Fetcher } from "../requests/methods.js";
import type { Certifications } from "./types/Certifications.js";

/**
 * ### [Movie Certifications](https://developer.themoviedb.org/reference/certification-movie-list)
 *
 * **GET** `/certification/movie/list`
 */
export const getMovieCertifications: Fetcher<null, Certifications> = async (
  options
) => get(`/certification/movie/list`, undefined, options);
