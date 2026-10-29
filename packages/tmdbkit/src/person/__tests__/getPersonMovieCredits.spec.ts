import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getPersonMovieCredits,
  getPersonMovieCreditsSchema
} from "../getPersonMovieCredits.js";
import { personMovieCreditsSchema } from "../types/PersonCredits.js";

describe(`getPersonMovieCredits`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/person/:personId/movie_credits`,
    getPersonMovieCreditsSchema,
    personMovieCreditsSchema
  );

  it(`sends GET /person/{person_id}/movie_credits and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getPersonMovieCredits,
        getPersonMovieCreditsSchema,
        personMovieCreditsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/person/${config.personId}/movie_credits`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`personMovieCreditsSchema`, () => {
  // Real responses (fixtures/person-movie-credits) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`person-movie-credits`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(personMovieCreditsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
