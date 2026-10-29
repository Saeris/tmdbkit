import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

/**
 * TMDB's release types (https://developer.themoviedb.org/reference/movie-release-dates, verified 2026-10-28): `1` Premiere, `2` Theatrical (limited), `3` Theatrical, `4` Digital, `5` Physical, `6` TV.
 */
export const releaseType = v.picklist([1, 2, 3, 4, 5, 6]);

const _releaseDateSchema = v.object({
  /** The rating in that region (e.g. `PG-13`), or `""`. */
  certification: v.string(),
  /** Content descriptors. TMDB doesn't document their type, and only empty arrays were recorded, so they're left `unknown`. */
  descriptors: v.array(v.unknown()),
  /** Language of the release, or `""`. */
  iso_639_1: v.string(),
  /** e.g. a festival name, or `""`. */
  note: v.string(),
  /** ISO 8601 timestamp, e.g. `2012-08-28T00:00:00.000Z`. */
  releaseDate: v.string(),
  type: releaseType
});

export interface ReleaseDate extends v.InferOutput<typeof _releaseDateSchema> {}

const _movieReleaseDatesSchema = v.object({
  id: integer,
  results: v.array(
    v.object({
      /** ISO 3166-1 code. */
      iso_3166_1: v.string(),
      releaseDates: v.array(schema<ReleaseDate>(_releaseDateSchema))
    })
  )
});

export interface MovieReleaseDates extends v.InferOutput<
  typeof _movieReleaseDatesSchema
> {}

/**
 * ### Movie Release Dates
 *
 * A movie's releases and content ratings, per region (`getMovieReleaseDates`): where Plex-style `mpaa` ratings come from.
 */
export const movieReleaseDatesSchema = schema<MovieReleaseDates>(
  _movieReleaseDatesSchema
);
