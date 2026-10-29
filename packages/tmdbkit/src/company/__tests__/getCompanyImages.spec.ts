import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getCompanyImages,
  getCompanyImagesSchema
} from "../getCompanyImages.js";
import { logoImagesSchema } from "../../types/Images.js";

describe(`getCompanyImages`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/company/:companyId/images`,
    getCompanyImagesSchema,
    logoImagesSchema
  );

  it(`sends GET /company/{company_id}/images and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getCompanyImages,
        getCompanyImagesSchema,
        logoImagesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/company/${config.companyId}/images`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`logoImagesSchema`, () => {
  // Real responses (fixtures/company-images) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`company-images`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(logoImagesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
