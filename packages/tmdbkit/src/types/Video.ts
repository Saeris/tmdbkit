import * as v from "valibot";
import { schema } from "../validations/schema.js";
import { integer } from "../validations/integer.js";

export const videoEntries = {
  id: v.string(),
  iso_3166_1: v.string(),
  iso_639_1: v.string(),
  /** The video's id on `site` (for YouTube, the `v=` value). */
  key: v.string(),
  name: v.string(),
  official: v.boolean(),
  /** ISO 8601 timestamp. */
  publishedAt: v.string(),
  /** Where the video is hosted, e.g. `YouTube`. */
  site: v.string(),
  /** Vertical resolution, e.g. `1080`. */
  size: integer,
  /** `Trailer`, `Teaser`, `Clip`, `Featurette`, `Behind the Scenes`, … */
  type: v.string()
} as const;

const _videoSchema = v.object(videoEntries);

export interface Video extends v.InferOutput<typeof _videoSchema> {}

/**
 * ### Video
 *
 * A trailer, teaser, clip or featurette hosted elsewhere (usually YouTube).
 */
export const videoSchema = schema<Video>(_videoSchema);

const _videosSchema = v.object({ id: integer, results: v.array(videoSchema) });

export interface Videos extends v.InferOutput<typeof _videosSchema> {}

/** The videos of a movie, TV series, season or episode. */
export const videosSchema = schema<Videos>(_videosSchema);
