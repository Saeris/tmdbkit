import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const id = v.nullable(v.string());

const _personExternalIdsSchema = v.object({
  id: integer,
  /** `nm…`, or `null` when unknown. */
  imdbId: id,
  freebaseMid: id,
  freebaseId: id,
  tvrageId: v.nullable(integer),
  wikidataId: id,
  facebookId: id,
  instagramId: id,
  /** `""` or `null` when unknown: TMDB returns both. */
  tiktokId: id,
  twitterId: id,
  /** `""` or `null` when unknown: TMDB returns both. */
  youtubeId: id
});

export interface PersonExternalIds extends v.InferOutput<
  typeof _personExternalIdsSchema
> {}

/**
 * ### Person External IDs
 *
 * A person's ids and social handles on other sites (`getPersonExternalIds`).
 */
export const personExternalIdsSchema = schema<PersonExternalIds>(
  _personExternalIdsSchema
);
