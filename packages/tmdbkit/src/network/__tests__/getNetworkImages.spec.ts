import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getNetworkImages,
  getNetworkImagesSchema
} from "../getNetworkImages.js";
import { logoImagesSchema } from "../../types/Images.js";

describe(`getNetworkImages`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/network/:networkId/images`,
    getNetworkImagesSchema,
    logoImagesSchema
  );

  it(`sends GET /network/{network_id}/images and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getNetworkImages,
        getNetworkImagesSchema,
        logoImagesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/network/${config.networkId}/images`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`logoImagesSchema`, () => {
  // Real responses (fixtures/network-images) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`network-images`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(logoImagesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
