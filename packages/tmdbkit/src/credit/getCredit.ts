import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { CreditDetails } from "./types/CreditDetails.js";

export const getCreditSchema = v.object({
  creditId: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/credit-details)
 *
 * **GET** `/credit/{credit_id}`
 */
export const getCredit: Fetcher<typeof getCreditSchema, CreditDetails> = async (
  { creditId, params },
  options
) => get(`/credit/${encodeURIComponent(creditId)}`, params, options);
