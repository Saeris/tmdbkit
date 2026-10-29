import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { getLatestMovie } from "../getLatestMovie.js";
import { movieDetailsSchema } from "../types/MovieDetails.js";

describe(`getLatestMovie`, { repeats: 5 }, () => {
  const { expected, requests } = mockUtils.request.get(
    `/movie/latest`,
    null,
    movieDetailsSchema
  );

  it(`sends GET /movie/latest and resolves the validated response`, async () => {
    await expect(
      toValidated(getLatestMovie, null, movieDetailsSchema)()
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/movie/latest`);
  });
});

// No recorded fixture: the `latest` endpoints return whatever was created last, which may be adult content. The response shares movieDetailsSchema with the details endpoint, whose fixtures are checked there.
