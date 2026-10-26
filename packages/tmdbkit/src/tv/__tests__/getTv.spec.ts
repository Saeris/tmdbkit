import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { getTv, getTvSchema } from "../getTv.js";
import { tvShowSchema } from "../types/TvShow.js";

describe(`getTv`, { repeats: 5 }, () => {
  const { config, expected } = mockUtils.request.get(
    `/tv/:seriesId`,
    getTvSchema,
    tvShowSchema
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(getTv, getTvSchema, tvShowSchema)(config)
    ).resolves.toEqual(expected);
  });
});
