import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";
import { creditPersonEntries } from "../../types/Credit.js";

const _aggregateCastSchema = v.object({
  ...creditPersonEntries,
  /** Every character the person played, with how many episodes each. */
  roles: v.array(
    v.object({
      creditId: v.string(),
      character: v.string(),
      episodeCount: integer
    })
  ),
  totalEpisodeCount: integer,
  order: integer
});

export interface AggregateCast extends v.InferOutput<
  typeof _aggregateCastSchema
> {}

const _aggregateCrewSchema = v.object({
  ...creditPersonEntries,
  department: v.string(),
  /** Every job the person held, with how many episodes each. */
  jobs: v.array(
    v.object({ creditId: v.string(), job: v.string(), episodeCount: integer })
  ),
  totalEpisodeCount: integer
});

export interface AggregateCrew extends v.InferOutput<
  typeof _aggregateCrewSchema
> {}

const _aggregateCreditsSchema = v.object({
  id: integer,
  cast: v.array(schema<AggregateCast>(_aggregateCastSchema)),
  crew: v.array(schema<AggregateCrew>(_aggregateCrewSchema))
});

export interface AggregateCredits extends v.InferOutput<
  typeof _aggregateCreditsSchema
> {}

/**
 * ### Aggregate Credits
 *
 * Everyone who appeared in or worked on a TV series or season, with every role or job they had and episode counts (`getTvSeriesAggregateCredits`, `getTvSeasonAggregateCredits`).
 */
export const aggregateCreditsSchema = schema<AggregateCredits>(
  _aggregateCreditsSchema
);
