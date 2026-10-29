import { get, type Fetcher } from "../requests/methods.js";
import type { MovieDetails } from "./types/MovieDetails.js";

/**
 * ### [Latest](https://developer.themoviedb.org/reference/movie-latest-id)
 *
 * **GET** `/movie/latest`
 */
export const getLatestMovie: Fetcher<null, MovieDetails> = async (options) =>
  get(`/movie/latest`, undefined, options);
