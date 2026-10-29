import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import { isoDate } from "../validations/isoDate.js";
import type { ChangeList } from "../types/ChangeList.js";

export const getPersonChangeListSchema = v.object({
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
 * ### [People List](https://developer.themoviedb.org/reference/changes-people-list)
 *
 * **GET** `/person/changes`
 */
export const getPersonChangeList: Fetcher<
  typeof getPersonChangeListSchema,
  ChangeList
> = async ({ params }, options) => get(`/person/changes`, params, options);
