import * as v from "valibot";
import { schema } from "../validations/schema.js";
import { integer } from "../validations/integer.js";

export const imageEntries = {
  aspectRatio: v.number(),
  /** Append to an image base URL (see `getConfiguration`) to load the file. */
  filePath: v.string(),
  height: integer,
  /** Region the image is for, or `null`. */
  iso_3166_1: v.nullable(v.string()),
  /** Language of the image's text, or `null` for images without text (most backdrops). */
  iso_639_1: v.nullable(v.string()),
  voteAverage: v.number(),
  voteCount: integer,
  width: integer
} as const;

const _imageSchema = v.object(imageEntries);

export interface Image extends v.InferOutput<typeof _imageSchema> {}

/**
 * ### Image
 *
 * One image (poster, backdrop, logo, still or profile) with its dimensions, language and votes.
 */
export const imageSchema = schema<Image>(_imageSchema);

const images = v.array(imageSchema);

const _mediaImagesSchema = v.object({
  id: integer,
  backdrops: images,
  /** Absent for collections, which have no logos. */
  logos: v.exactOptional(images),
  posters: images
});

export interface MediaImages extends v.InferOutput<typeof _mediaImagesSchema> {}

/** Images of a movie, TV series or collection (`getMovieImages`, `getTvSeriesImages`, `getCollectionImages`). */
export const mediaImagesSchema = schema<MediaImages>(_mediaImagesSchema);

const _posterImagesSchema = v.object({ id: integer, posters: images });

export interface PosterImages extends v.InferOutput<
  typeof _posterImagesSchema
> {}

/** A season's posters (`getTvSeasonImages`). */
export const posterImagesSchema = schema<PosterImages>(_posterImagesSchema);

const _stillImagesSchema = v.object({ id: integer, stills: images });

export interface StillImages extends v.InferOutput<typeof _stillImagesSchema> {}

/** An episode's stills (`getTvEpisodeImages`). */
export const stillImagesSchema = schema<StillImages>(_stillImagesSchema);

const _profileImagesSchema = v.object({ id: integer, profiles: images });

export interface ProfileImages extends v.InferOutput<
  typeof _profileImagesSchema
> {}

/** A person's profile photos (`getPersonImages`). */
export const profileImagesSchema = schema<ProfileImages>(_profileImagesSchema);

export const logoImageEntries = {
  aspectRatio: v.number(),
  filePath: v.string(),
  /** `.png` or `.svg`. */
  fileType: v.string(),
  height: integer,
  id: v.string(),
  voteAverage: v.number(),
  voteCount: integer,
  width: integer
} as const;

const _logoImageSchema = v.object(logoImageEntries);

export interface LogoImage extends v.InferOutput<typeof _logoImageSchema> {}

/** A company or network logo: unlike media images it has its own id and a file type, and no language. */
export const logoImageSchema = schema<LogoImage>(_logoImageSchema);

const _logoImagesSchema = v.object({
  id: integer,
  logos: v.array(logoImageSchema)
});

export interface LogoImages extends v.InferOutput<typeof _logoImagesSchema> {}

/** A company's or network's logos (`getCompanyImages`, `getNetworkImages`). */
export const logoImagesSchema = schema<LogoImages>(_logoImagesSchema);
