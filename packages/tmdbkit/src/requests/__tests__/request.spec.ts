import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  vi
} from "vite-plus/test";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { API_KEY_ENV_VAR, tmdb, TOKEN_ENV_VAR } from "../TmdbSession.js";
import { request, TmdbApiError } from "../request.js";

const server = setupServer();
const movie = `https://api.themoviedb.org/3/movie/11`;

describe(`request`, () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: `error` });
  });
  beforeEach(() => {
    vi.stubEnv(TOKEN_ENV_VAR, ``);
    vi.stubEnv(API_KEY_ENV_VAR, ``);
    tmdb.clearSession();
    tmdb.setToken(`test-token`);
  });
  afterEach(() => {
    server.resetHandlers();
    vi.unstubAllEnvs();
  });
  afterAll(() => {
    server.close();
    tmdb.clearSession();
  });

  it(`converts TMDB's snake_case response to camelCase`, async () => {
    server.use(
      http.get(movie, () =>
        HttpResponse.json({
          original_title: `Star Wars`,
          belongs_to_collection: { poster_path: `/a.jpg` }
        })
      )
    );
    await expect(request(new URL(movie))).resolves.toStrictEqual({
      originalTitle: `Star Wars`,
      belongsToCollection: { posterPath: `/a.jpg` }
    });
  });

  // Callers branch on TMDB's own codes (34 = not found, 7 = invalid key), not just the HTTP status.
  it(`turns TMDB's error body into a TmdbApiError`, async () => {
    server.use(
      http.get(movie, () =>
        HttpResponse.json(
          {
            success: false,
            status_code: 34,
            status_message: `The resource you requested could not be found.`
          },
          { status: 404 }
        )
      )
    );
    const error = await request(new URL(movie)).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(TmdbApiError);
    expect(error).toMatchObject({
      status: 404,
      statusCode: 34,
      statusMessage: `The resource you requested could not be found.`
    });
  });

  it(`falls back to the status text when the error body isn't JSON`, async () => {
    server.use(
      http.get(
        movie,
        () =>
          new HttpResponse(`<html>bad gateway</html>`, {
            status: 400,
            statusText: `Bad Request`
          })
      )
    );
    await expect(request(new URL(movie))).rejects.toMatchObject({
      status: 400,
      statusCode: 0,
      statusMessage: `Bad Request`
    });
  });

  // Error messages end up in logs and bug reports; a v3 key in the query string must not.
  it(`keeps the api key out of error messages`, async () => {
    tmdb.clearSession();
    tmdb.setApiKey(`s3cret-key`);
    server.use(
      http.get(movie, () =>
        HttpResponse.json(
          { status_code: 7, status_message: `Invalid API key` },
          { status: 401 }
        )
      )
    );
    const error = await request(new URL(movie)).catch((e: unknown) => e);
    expect(String(error)).toContain(`GET /3/movie/11`);
    expect(String(error)).not.toContain(`s3cret-key`);
  });

  it(`resolves to undefined on 204 No Content`, async () => {
    server.use(
      http.delete(movie, () => new HttpResponse(null, { status: 204 }))
    );
    await expect(request(new URL(movie), `DELETE`)).resolves.toBeUndefined();
  });

  it(`sends bodies as snake_case JSON`, async () => {
    let received: unknown;
    let contentType: string | null = null;
    server.use(
      http.post(`${movie}/rating`, async ({ request: req }) => {
        received = await req.json();
        contentType = req.headers.get(`Content-Type`);
        return HttpResponse.json({ status_code: 1 });
      })
    );
    await request(new URL(`${movie}/rating`), `POST`, { ratingValue: 8.5 });
    expect(received).toStrictEqual({ rating_value: 8.5 });
    expect(contentType).toBe(`application/json`);
  });

  // `onUnhandledRequest: "error"` would also fail this test if anything reached the network.
  it(`fails before any network call when no credentials are configured`, async () => {
    tmdb.clearSession();
    await expect(request(new URL(movie))).rejects.toThrow(TOKEN_ENV_VAR);
  });
});
