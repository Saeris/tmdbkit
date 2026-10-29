import * as v from "valibot";
import { schema, variantSchema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { imageEntries } from "../../types/Images.js";
import { pageEntries } from "../../types/PagedResults.js";
import {
  movieMediaListItemSchema,
  type MovieMediaListItem
} from "../../movie/types/MovieListItem.js";
import {
  tvMediaListItemSchema,
  type TvMediaListItem
} from "../../tv/types/TvListItem.js";

const _taggedImageSchema = v.object({
  ...imageEntries,
  id: v.string(),
  /** `backdrop`, `poster`, `still`, … */
  imageType: v.string(),
  /** The title the image is from. */
  media: variantSchema<MovieMediaListItem | TvMediaListItem>(`mediaType`, [
    movieMediaListItemSchema,
    tvMediaListItemSchema
  ]),
  mediaType: v.string()
});

export interface TaggedImage extends v.InferOutput<typeof _taggedImageSchema> {}

const _taggedImagesSchema = v.object({
  id: integer,
  ...pageEntries,
  results: v.array(schema<TaggedImage>(_taggedImageSchema))
});

export interface TaggedImages extends v.InferOutput<
  typeof _taggedImagesSchema
> {}

/**
 * ### Tagged Images
 *
 * A page of images from movies and TV series that a person has been tagged in (`getPersonTaggedImages`).
 */
export const taggedImagesSchema = schema<TaggedImages>(_taggedImagesSchema);
