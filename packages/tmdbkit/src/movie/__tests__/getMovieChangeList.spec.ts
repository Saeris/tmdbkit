import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getMovieChangeList,
  getMovieChangeListSchema
} from "../getMovieChangeList.js";
import { changeListSchema } from "../../types/ChangeList.js";

describe(`getMovieChangeList`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/movie/changes`,
    getMovieChangeListSchema,
    changeListSchema
  );

  it(`sends GET /movie/changes and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getMovieChangeList,
        getMovieChangeListSchema,
        changeListSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/movie/changes`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`changeListSchema`, () => {
  // Real responses (fixtures/movie-changes-list) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`movie-changes-list`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(changeListSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
