import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getMovieLists, getMovieListsSchema } from "../getMovieLists.js";
import { listsContainingSchema } from "../../list/types/ListsContaining.js";

describe(`getMovieLists`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId/lists`,
    getMovieListsSchema,
    listsContainingSchema
  );

  it(`sends GET /movie/{movie_id}/lists and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieLists,
        getMovieListsSchema,
        listsContainingSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/movie/${config.movieId}/lists`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`listsContainingSchema`, () => {
  // Real responses (fixtures/movie-lists) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-lists`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(listsContainingSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
