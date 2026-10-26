import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { getSeason, getSeasonSchema } from "../getSeason.js";
import { seasonSchema } from "../../types/Season.js";

describe(`getSeason`, { repeats: 5 }, () => {
  const { config, expected } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber`,
    getSeasonSchema,
    seasonSchema
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(getSeason, getSeasonSchema, seasonSchema)(config)
    ).resolves.toEqual(expected);
  });
});
