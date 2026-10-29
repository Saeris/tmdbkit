import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { ListItemStatus } from "./types/ListItemStatus.js";

export const getListItemStatusSchema = v.object({
  listId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        movieId: integer
      })
    )
  )
});

/**
 * ### [Check Item Status](https://developer.themoviedb.org/reference/list-check-item-status)
 *
 * **GET** `/list/{list_id}/item_status`
 */
export const getListItemStatus: Fetcher<
  typeof getListItemStatusSchema,
  ListItemStatus
> = async ({ listId, params }, options) =>
  get(`/list/${listId}/item_status`, params, options);
