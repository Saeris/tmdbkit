import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { getMovie, getMovieSchema } from "../getMovie.js";
import { movieSchema } from "../types/Movie.js";

describe(`getMovie`, { repeats: 5 }, () => {
  const { config, expected } = mockUtils.request.get(
    `/movie/:movieId`,
    getMovieSchema,
    movieSchema
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(getMovie, getMovieSchema, movieSchema)(config)
    ).resolves.toEqual(expected);
  });
});
