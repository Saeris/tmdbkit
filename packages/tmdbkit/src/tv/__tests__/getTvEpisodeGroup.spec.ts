import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvEpisodeGroup,
  getTvEpisodeGroupSchema
} from "../getTvEpisodeGroup.js";
import { episodeGroupDetailsSchema } from "../types/EpisodeGroups.js";

describe(`getTvEpisodeGroup`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/episode_group/:tvEpisodeGroupId`,
    getTvEpisodeGroupSchema,
    episodeGroupDetailsSchema
  );

  it(`sends GET /tv/episode_group/{tv_episode_group_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvEpisodeGroup,
        getTvEpisodeGroupSchema,
        episodeGroupDetailsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/episode_group/${config.tvEpisodeGroupId}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`episodeGroupDetailsSchema`, () => {
  // Real responses (fixtures/tv-episode-group-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-episode-group-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(episodeGroupDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
