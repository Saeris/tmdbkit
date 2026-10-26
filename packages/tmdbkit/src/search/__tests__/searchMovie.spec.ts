import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { searchMovie, searchMovieSchema } from "../searchMovie.js";
import { pagedResults } from "../../types/PagedResults.js";
import { searchMovieResultSchema } from "../types/SearchMovieResult.js";

describe(`searchMovie`, { repeats: 5 }, () => {
  const { config, expected } = mockUtils.request.get(
    `/search/movie`,
    searchMovieSchema,
    pagedResults(searchMovieResultSchema)
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(
        searchMovie,
        searchMovieSchema,
        pagedResults(searchMovieResultSchema)
      )(config)
    ).resolves.toEqual(expected);
  });
});
