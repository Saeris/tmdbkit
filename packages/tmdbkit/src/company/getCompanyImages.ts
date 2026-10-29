import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { LogoImages } from "../types/Images.js";

export const getCompanyImagesSchema = v.object({
  companyId: tmdbId
});

/**
 * ### [Images](https://developer.themoviedb.org/reference/company-images)
 *
 * **GET** `/company/{company_id}/images`
 */
export const getCompanyImages: Fetcher<
  typeof getCompanyImagesSchema,
  LogoImages
> = async ({ companyId }, options) =>
  get(`/company/${companyId}/images`, undefined, options);
