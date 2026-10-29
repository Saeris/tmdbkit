import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  afterAll
} from "vite-plus/test";
import { http, HttpResponse, type JsonBodyType } from "msw";
import { setupServer } from "msw/node";
import {
  getMovie,
  getMovieSchema,
  imageUrl,
  movieDetailsSchema,
  searchMovies,
  tmdb,
  TmdbApiError,
  toValidated
} from "../index.js";

// The README's examples, run against TMDB's real recorded responses through the real request layer, imported from the package root as a consumer would. If the README stops matching the API, this fails.

/** A recorded TMDB response, raw (snake_case) as the API sends it. */
const fixture = (file: string): JsonBodyType =>
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  JSON.parse(
    readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        `..`,
        `..`,
        `fixtures`,
        file
      ),
      `utf8`
    )
  ) as JsonBodyType;

const api = `https://api.themoviedb.org/3`;
const server = setupServer(
  http.get(`${api}/search/movie`, () =>
    HttpResponse.json(fixture(`search-movie/star-wars.json`))
  ),
  http.get(`${api}/movie/:movieId`, ({ params }) =>
    params.movieId === `11`
      ? HttpResponse.json(fixture(`movie-details/starWars-appended.json`))
      : HttpResponse.json(fixture(`error/not-found.json`), { status: 404 })
  )
);

describe(`the examples in the README`, () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: `error` });
    tmdb.setToken(`test-token`);
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
    tmdb.clearSession();
  });

  it(`searches, fetches details with appended credits, and builds an image URL`, async () => {
    const { results } = await searchMovies({
      query: `Star Wars`,
      params: { year: 1977 }
    });
    const movie = await getMovie({
      movieId: 11,
      params: { appendToResponse: [`credits`, `release_dates`] }
    });

    expect(results.length).toBeGreaterThan(0);
    expect(movie.title).toBe(`Star Wars`);
    expect(movie.credits?.cast[0].character).toBeTypeOf(`string`);
    expect(imageUrl(movie.posterPath, `w500`)).toMatch(
      /^https:\/\/image\.tmdb\.org\/t\/p\/w500\/.+\.jpg$/
    );
  });

  it(`validates a response with toValidated`, async () => {
    const getMovieSafe = toValidated(
      getMovie,
      getMovieSchema,
      movieDetailsSchema
    );
    await expect(getMovieSafe({ movieId: 11 })).resolves.toMatchObject({
      id: 11
    });
  });

  it(`reports TMDB errors as TmdbApiError with TMDB's own status code`, async () => {
    const error = await getMovie({ movieId: 999999999 }).catch(
      (e: unknown) => e
    );
    expect(error).toBeInstanceOf(TmdbApiError);
    expect(error).toMatchObject({ status: 404, statusCode: 34 });
  });

  it(`cancels a request through its signal`, async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      getMovie({ movieId: 11 }, { signal: controller.signal })
    ).rejects.toMatchObject({ name: `AbortError` });
  });
});
