import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getNowPlayingMovies,
  getNowPlayingMoviesSchema
} from "../getNowPlayingMovies.js";
import { datedMovieResultsSchema } from "../types/MovieListItem.js";

describe(`getNowPlayingMovies`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/now_playing`,
    getNowPlayingMoviesSchema,
    datedMovieResultsSchema
  );

  it(`sends GET /movie/now_playing and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getNowPlayingMovies,
        getNowPlayingMoviesSchema,
        datedMovieResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/movie/now_playing`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`datedMovieResultsSchema`, () => {
  // Real responses (fixtures/movie-now-playing) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-now-playing`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(datedMovieResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
