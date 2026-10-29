import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getKeywordMovies,
  getKeywordMoviesSchema
} from "../getKeywordMovies.js";
import { pagedMovieResultsSchema } from "../../movie/types/MovieListItem.js";

describe(`getKeywordMovies`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/keyword/:keywordId/movies`,
    getKeywordMoviesSchema,
    pagedMovieResultsSchema
  );

  it(`sends GET /keyword/{keyword_id}/movies and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getKeywordMovies,
        getKeywordMoviesSchema,
        pagedMovieResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/keyword/${config.keywordId}/movies`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedMovieResultsSchema`, () => {
  // Real responses (fixtures/keyword-movies) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`keyword-movies`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedMovieResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
