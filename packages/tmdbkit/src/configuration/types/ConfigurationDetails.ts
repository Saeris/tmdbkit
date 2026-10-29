import * as v from "valibot";
import { schema } from "../../validations/schema.js";

const _configurationDetailsSchema = v.object({
  /** The `key`s a change can have (see `Changes`). */
  changeKeys: v.array(v.string()),
  images: v.object({
    /** `http://` base for image URLs: `${baseUrl}${size}${filePath}`. Prefer `secureBaseUrl`. */
    baseUrl: v.string(),
    /** `https://` base for image URLs: `${secureBaseUrl}${size}${filePath}`. */
    secureBaseUrl: v.string(),
    /** Sizes accepted for backdrops, e.g. `w780`, `original`. */
    backdropSizes: v.array(v.string()),
    logoSizes: v.array(v.string()),
    posterSizes: v.array(v.string()),
    profileSizes: v.array(v.string()),
    stillSizes: v.array(v.string())
  })
});

export interface ConfigurationDetails extends v.InferOutput<
  typeof _configurationDetailsSchema
> {}

/**
 * ### Configuration
 *
 * The image base URLs and sizes needed to turn an image's `filePath` into a URL, plus the known change keys. TMDB rarely changes these; cache them.
 */
export const configurationDetailsSchema = schema<ConfigurationDetails>(
  _configurationDetailsSchema
);
