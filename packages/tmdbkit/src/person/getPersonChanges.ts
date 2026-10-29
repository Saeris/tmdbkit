import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import { isoDate } from "../validations/isoDate.js";
import type { Changes } from "../types/Changes.js";

export const getPersonChangesSchema = v.object({
  personId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        endDate: isoDate,
        page: integer,
        startDate: isoDate
      })
    )
  )
});

/**
 * ### [Changes](https://developer.themoviedb.org/reference/person-changes)
 *
 * **GET** `/person/{person_id}/changes`
 */
export const getPersonChanges: Fetcher<
  typeof getPersonChangesSchema,
  Changes
> = async ({ personId, params }, options) =>
  get(`/person/${personId}/changes`, params, options);
