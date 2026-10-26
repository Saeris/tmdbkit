import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const imageConfigurationEntries = {
  /** the base URL for images */
  baseUrl: v.string(),
  /** the secure base URL for images */
  secureBaseUrl: v.string(),
  /** the available backdrop sizes */
  backdropSizes: v.array(v.string()),
  /** the available logo sizes */
  logoSizes: v.array(v.string()),
  /** the available poster sizes */
  posterSizes: v.array(v.string()),
  /** the available profile sizes */
  profileSizes: v.array(v.string()),
  /** the available still sizes */
  stillSizes: v.array(v.string())
} as const;

const _imageConfigurationSchema = v.object(imageConfigurationEntries);

export interface ImageConfiguration extends v.InferOutput<
  typeof _imageConfigurationSchema
> {}

/**
 * Image configuration from the [Configuration](https://www.themoviedb.org/documentation/api/configuration) endpoint.
 */
export const imageConfigurationSchema = schema<ImageConfiguration>(
  _imageConfigurationSchema
);

export const configurationEntries = {
  /** the image configuration */
  images: imageConfigurationSchema,
  /** the list of change keys */
  changeKeys: v.array(v.string())
} as const;

const _configurationSchema = v.object(configurationEntries);

export interface Configuration extends v.InferOutput<
  typeof _configurationSchema
> {}

/**
 * ### [Configuration](https://www.themoviedb.org/documentation/api/configuration)
 *
 * Returns the image configurations and change keys.
 */
export const configurationSchema = schema<Configuration>(_configurationSchema);
