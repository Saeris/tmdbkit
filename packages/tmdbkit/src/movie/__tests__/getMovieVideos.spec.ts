import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getMovieVideos, getMovieVideosSchema } from "../getMovieVideos.js";
import { videosSchema } from "../../types/Video.js";

describe(`getMovieVideos`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/videos`,
    getMovieVideosSchema,
    videosSchema
  );

  it(`sends GET /movie/{movie_id}/videos and resolves the validated response`, async () => {
    await expect(
      toValidated(getMovieVideos, getMovieVideosSchema, videosSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/videos`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`videosSchema`, () => {
  // Real responses (fixtures/movie-videos) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-videos`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(videosSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
