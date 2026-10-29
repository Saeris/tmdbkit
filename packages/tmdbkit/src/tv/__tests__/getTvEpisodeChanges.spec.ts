import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvEpisodeChanges,
  getTvEpisodeChangesSchema
} from "../getTvEpisodeChanges.js";
import { changesSchema } from "../../types/Changes.js";

describe(`getTvEpisodeChanges`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/episode/:episodeId/changes`,
    getTvEpisodeChangesSchema,
    changesSchema
  );

  it(`sends GET /tv/episode/{episode_id}/changes and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvEpisodeChanges,
        getTvEpisodeChangesSchema,
        changesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/episode/${config.episodeId}/changes`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`changesSchema`, () => {
  // Real responses (fixtures/tv-episode-changes) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-episode-changes`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(changesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
