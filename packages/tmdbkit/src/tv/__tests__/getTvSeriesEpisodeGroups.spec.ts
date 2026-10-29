import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesEpisodeGroups,
  getTvSeriesEpisodeGroupsSchema
} from "../getTvSeriesEpisodeGroups.js";
import { episodeGroupsSchema } from "../types/EpisodeGroups.js";

describe(`getTvSeriesEpisodeGroups`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/episode_groups`,
    getTvSeriesEpisodeGroupsSchema,
    episodeGroupsSchema
  );

  it(`sends GET /tv/{series_id}/episode_groups and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesEpisodeGroups,
        getTvSeriesEpisodeGroupsSchema,
        episodeGroupsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/episode_groups`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`episodeGroupsSchema`, () => {
  // Real responses (fixtures/tv-episode-groups) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-episode-groups`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(episodeGroupsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
