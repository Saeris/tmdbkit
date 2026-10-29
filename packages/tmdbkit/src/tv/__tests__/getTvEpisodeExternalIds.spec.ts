import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvEpisodeExternalIds,
  getTvEpisodeExternalIdsSchema
} from "../getTvEpisodeExternalIds.js";
import { tvEpisodeExternalIdsSchema } from "../types/TvExternalIds.js";

describe(`getTvEpisodeExternalIds`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber/episode/:episodeNumber/external_ids`,
    getTvEpisodeExternalIdsSchema,
    tvEpisodeExternalIdsSchema
  );

  it(`sends GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/external_ids and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvEpisodeExternalIds,
        getTvEpisodeExternalIdsSchema,
        tvEpisodeExternalIdsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/season/${config.seasonNumber}/episode/${config.episodeNumber}/external_ids`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`tvEpisodeExternalIdsSchema`, () => {
  // Real responses (fixtures/tv-episode-external-ids) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-episode-external-ids`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(tvEpisodeExternalIdsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
