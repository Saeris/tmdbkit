import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getTvEpisode, getTvEpisodeSchema } from "../getTvEpisode.js";
import { tvEpisodeDetailsSchema } from "../types/TvEpisodeDetails.js";

describe(`getTvEpisode`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber/episode/:episodeNumber`,
    getTvEpisodeSchema,
    tvEpisodeDetailsSchema
  );

  it(`sends GET /tv/{series_id}/season/{season_number}/episode/{episode_number} and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvEpisode,
        getTvEpisodeSchema,
        tvEpisodeDetailsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/season/${config.seasonNumber}/episode/${config.episodeNumber}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`tvEpisodeDetailsSchema`, () => {
  // Real responses (fixtures/tv-episode-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-episode-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(tvEpisodeDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
