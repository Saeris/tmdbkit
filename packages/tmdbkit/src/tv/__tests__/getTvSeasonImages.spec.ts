import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeasonImages,
  getTvSeasonImagesSchema
} from "../getTvSeasonImages.js";
import { posterImagesSchema } from "../../types/Images.js";

describe(`getTvSeasonImages`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/:seriesId/season/:seasonNumber/images`,
    getTvSeasonImagesSchema,
    posterImagesSchema
  );

  it(`sends GET /tv/{series_id}/season/{season_number}/images and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeasonImages,
        getTvSeasonImagesSchema,
        posterImagesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/tv/${config.seriesId}/season/${config.seasonNumber}/images`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`posterImagesSchema`, () => {
  // Real responses (fixtures/tv-season-images) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-season-images`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(posterImagesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
