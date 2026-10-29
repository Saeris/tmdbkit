import { get, type Fetcher } from "../requests/methods.js";
import type { DepartmentJobs } from "./types/DepartmentJobs.js";

/**
 * ### [Jobs](https://developer.themoviedb.org/reference/configuration-jobs)
 *
 * **GET** `/configuration/jobs`
 */
export const getJobs: Fetcher<null, DepartmentJobs> = async (options) =>
  get(`/configuration/jobs`, undefined, options);
