import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { ListDetails } from "./types/ListDetails.js";

export const getListSchema = v.object({
  listId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        page: integer
      })
    )
  )
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/list-details)
 *
 * **GET** `/list/{list_id}`
 */
export const getList: Fetcher<typeof getListSchema, ListDetails> = async (
  { listId, params },
  options
) => get(`/list/${listId}`, params, options);
