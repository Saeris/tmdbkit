import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { TaggedImages } from "./types/TaggedImages.js";

export const getPersonTaggedImagesSchema = v.object({
  personId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        page: integer
      })
    )
  )
});

/**
 * ### [Tagged Images](https://developer.themoviedb.org/reference/person-tagged-images)
 *
 * **GET** `/person/{person_id}/tagged_images`
 */
export const getPersonTaggedImages: Fetcher<
  typeof getPersonTaggedImagesSchema,
  TaggedImages
> = async ({ personId, params }, options) =>
  get(`/person/${personId}/tagged_images`, params, options);
