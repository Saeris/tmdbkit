import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { getEpisode, getEpisodeSchema } from "../getEpisode.js";
import { episodeSchema } from "../../types/Episode.js";

describe(`getEpisode`, { repeats: 5 }, () => {
  const { config, expected } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber/episode/:episodeNumber`,
    getEpisodeSchema,
    episodeSchema
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(getEpisode, getEpisodeSchema, episodeSchema)(config)
    ).resolves.toEqual(expected);
  });
});
