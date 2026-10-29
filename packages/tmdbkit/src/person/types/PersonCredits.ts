import * as v from "valibot";
import { schema, variantSchema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { movieListItemEntries } from "../../movie/types/MovieListItem.js";
import { tvListItemEntries } from "../../tv/types/TvListItem.js";

const castRole = {
  /** The role played, or `""` when unknown. */
  character: v.string(),
  creditId: v.string()
} as const;

const crewRole = {
  creditId: v.string(),
  department: v.string(),
  job: v.string()
} as const;

/** How much of a series a TV credit covers. */
const tvCreditSpan = {
  episodeCount: integer,
  /** `YYYY-MM-DD` of the person's first episode, or `null`. */
  firstCreditAirDate: v.nullable(v.string())
} as const;

const _personMovieCastSchema = v.object({
  ...movieListItemEntries,
  ...castRole,
  order: integer
});
const _personMovieCrewSchema = v.object({
  ...movieListItemEntries,
  ...crewRole
});
const _personTvCastSchema = v.object({
  ...tvListItemEntries,
  ...castRole,
  ...tvCreditSpan
});
const _personTvCrewSchema = v.object({
  ...tvListItemEntries,
  ...crewRole,
  ...tvCreditSpan
});

export interface PersonMovieCast extends v.InferOutput<
  typeof _personMovieCastSchema
> {}
export interface PersonMovieCrew extends v.InferOutput<
  typeof _personMovieCrewSchema
> {}
export interface PersonTvCast extends v.InferOutput<
  typeof _personTvCastSchema
> {}
export interface PersonTvCrew extends v.InferOutput<
  typeof _personTvCrewSchema
> {}

const _personMovieCreditsSchema = v.object({
  id: integer,
  cast: v.array(schema<PersonMovieCast>(_personMovieCastSchema)),
  crew: v.array(schema<PersonMovieCrew>(_personMovieCrewSchema))
});

export interface PersonMovieCredits extends v.InferOutput<
  typeof _personMovieCreditsSchema
> {}

/**
 * ### Person Movie Credits
 *
 * The movies a person acted in or worked on (`getPersonMovieCredits`).
 */
export const personMovieCreditsSchema = schema<PersonMovieCredits>(
  _personMovieCreditsSchema
);

const _personTvCreditsSchema = v.object({
  id: integer,
  cast: v.array(schema<PersonTvCast>(_personTvCastSchema)),
  crew: v.array(schema<PersonTvCrew>(_personTvCrewSchema))
});

export interface PersonTvCredits extends v.InferOutput<
  typeof _personTvCreditsSchema
> {}

/** The TV series a person appeared in or worked on, with episode counts (`getPersonTvCredits`). */
export const personTvCreditsSchema = schema<PersonTvCredits>(
  _personTvCreditsSchema
);

type Tagged<T, M extends string> = T & { mediaType: M };

export type PersonCombinedCast =
  | Tagged<PersonMovieCast, `movie`>
  | Tagged<PersonTvCast, `tv`>;
export type PersonCombinedCrew =
  | Tagged<PersonMovieCrew, `movie`>
  | Tagged<PersonTvCrew, `tv`>;

const _personCombinedCreditsSchema = v.object({
  id: integer,
  cast: v.array(
    variantSchema<PersonCombinedCast>(`mediaType`, [
      v.object({
        ..._personMovieCastSchema.entries,
        mediaType: v.literal(`movie`)
      }),
      v.object({ ..._personTvCastSchema.entries, mediaType: v.literal(`tv`) })
    ])
  ),
  crew: v.array(
    variantSchema<PersonCombinedCrew>(`mediaType`, [
      v.object({
        ..._personMovieCrewSchema.entries,
        mediaType: v.literal(`movie`)
      }),
      v.object({ ..._personTvCrewSchema.entries, mediaType: v.literal(`tv`) })
    ])
  )
});

export interface PersonCombinedCredits extends v.InferOutput<
  typeof _personCombinedCreditsSchema
> {}

/** A person's movie and TV credits together, each tagged with its `mediaType` (`getPersonCombinedCredits`). */
export const personCombinedCreditsSchema = schema<PersonCombinedCredits>(
  _personCombinedCreditsSchema
);
