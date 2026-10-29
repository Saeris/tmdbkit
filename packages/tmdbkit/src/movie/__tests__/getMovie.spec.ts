import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { getMovie, getMovieSchema } from "../getMovie.js";
import { movieSchema } from "../types/Movie.js";

// One mocked route per spec file: msw serves the most recently registered handler, and every `describe` registers its handler when the file is collected.
describe(`getMovie`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/:movieId`,
    getMovieSchema,
    movieSchema
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(getMovie, getMovieSchema, movieSchema)(config)
    ).resolves.toEqual(expected);
    expect(new URL(requests.at(-1)?.url ?? ``).pathname).toBe(
      `/3/movie/${config.movieId}`
    );
  });

  // TMDB reads append_to_response as one comma-separated value; repeated keys silently drop all but one of the appended payloads.
  it(`sends the appended methods as one comma-separated value`, async () => {
    await getMovie({
      movieId: 11,
      params: { appendToResponse: [`credits`, `images`, `release_dates`] }
    });
    const sent = new URL(requests.at(-1)?.url ?? ``).searchParams;
    expect(sent.getAll(`append_to_response`)).toStrictEqual([
      `credits,images,release_dates`
    ]);
  });
});
