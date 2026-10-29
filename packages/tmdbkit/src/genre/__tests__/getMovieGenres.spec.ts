import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getMovieGenres, getMovieGenresSchema } from "../getMovieGenres.js";
import { genreListSchema } from "../types/GenreList.js";

describe(`getMovieGenres`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/genre/movie/list`,
    getMovieGenresSchema,
    genreListSchema
  );

  it(`sends GET /genre/movie/list and resolves the validated response`, async () => {
    await expect(
      toValidated(getMovieGenres, getMovieGenresSchema, genreListSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/genre/movie/list`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`genreListSchema`, () => {
  // Real responses (fixtures/genre-movie-list) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`genre-movie-list`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(genreListSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
