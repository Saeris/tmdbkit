import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getTvSeriesOnTheAir,
  getTvSeriesOnTheAirSchema
} from "../getTvSeriesOnTheAir.js";
import { pagedTvResultsSchema } from "../types/TvListItem.js";

describe(`getTvSeriesOnTheAir`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/tv/on_the_air`,
    getTvSeriesOnTheAirSchema,
    pagedTvResultsSchema
  );

  it(`sends GET /tv/on_the_air and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getTvSeriesOnTheAir,
        getTvSeriesOnTheAirSchema,
        pagedTvResultsSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/tv/on_the_air`);
    expect(Object.fromEntries(sent.searchParams)).toEqual(
      expectedQuery({ ...config.params })
    );
  });
});

describe(`pagedTvResultsSchema`, () => {
  // Real responses (fixtures/tv-on-the-air) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`tv-on-the-air`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(pagedTvResultsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
