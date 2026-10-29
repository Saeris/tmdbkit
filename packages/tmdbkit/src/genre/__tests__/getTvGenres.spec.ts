import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getTvGenres, getTvGenresSchema } from "../getTvGenres.js";
import { genreListSchema } from "../types/GenreList.js";

describe(`getTvGenres`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/genre/tv/list`,
    getTvGenresSchema,
    genreListSchema
  );

  it(`sends GET /genre/tv/list and resolves the validated response`, async () => {
    await expect(
      toValidated(getTvGenres, getTvGenresSchema, genreListSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/genre/tv/list`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`genreListSchema`, () => {
  // Real responses (fixtures/genre-tv-list) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`genre-tv-list`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(genreListSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
