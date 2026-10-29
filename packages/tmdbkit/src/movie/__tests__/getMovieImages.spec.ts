import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getMovieImages, getMovieImagesSchema } from "../getMovieImages.js";
import { mediaImagesSchema } from "../../types/Images.js";

describe(`getMovieImages`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/images`,
    getMovieImagesSchema,
    mediaImagesSchema
  );

  it(`sends GET /movie/{movie_id}/images and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieImages,
        getMovieImagesSchema,
        mediaImagesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/images`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`mediaImagesSchema`, () => {
  // Real responses (fixtures/movie-images) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-images`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(mediaImagesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
