import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { ProfileImages } from "../types/Images.js";

export const getPersonImagesSchema = v.object({
  personId: tmdbId
});

/**
 * ### [Images](https://developer.themoviedb.org/reference/person-images)
 *
 * **GET** `/person/{person_id}/images`
 */
export const getPersonImages: Fetcher<
  typeof getPersonImagesSchema,
  ProfileImages
> = async ({ personId }, options) =>
  get(`/person/${personId}/images`, undefined, options);
