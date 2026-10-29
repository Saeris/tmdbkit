import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { searchMovies, searchMoviesSchema } from "../searchMovies.js";
import { pagedMovieResultsSchema } from "../../movie/types/MovieListItem.js";

describe(`searchMovies`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/search/movie`,
    searchMoviesSchema,
    pagedMovieResultsSchema
  );

  it(`sends GET /search/movie and resolves the validated response`, async () => {
    await expect(
      toValidated(
        searchMovies,
        searchMoviesSchema,
        pagedMovieResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/search/movie`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params, query: config.query })
    );
  });
});

describe(`pagedMovieResultsSchema`, () => {
  // Real responses (fixtures/search-movie) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`search-movie`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedMovieResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
