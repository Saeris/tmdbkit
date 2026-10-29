import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvEpisodeImages,
  getTvEpisodeImagesSchema
} from "../getTvEpisodeImages.js";
import { stillImagesSchema } from "../../types/Images.js";

describe(`getTvEpisodeImages`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber/episode/:episodeNumber/images`,
    getTvEpisodeImagesSchema,
    stillImagesSchema
  );

  it(`sends GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/images and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvEpisodeImages,
        getTvEpisodeImagesSchema,
        stillImagesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/season/${config.seasonNumber}/episode/${config.episodeNumber}/images`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`stillImagesSchema`, () => {
  // Real responses (fixtures/tv-episode-images) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-episode-images`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(stillImagesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
