import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import {
  getNetworkAlternativeNames,
  getNetworkAlternativeNamesSchema
} from "../getNetworkAlternativeNames.js";
import { alternativeNamesSchema } from "../../types/AlternativeNames.js";

describe(`getNetworkAlternativeNames`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/network/:networkId/alternative_names`,
    getNetworkAlternativeNamesSchema,
    alternativeNamesSchema
  );

  it(`sends GET /network/{network_id}/alternative_names and resolves the validated response`, async () => {
    await expect(
      toValidated(
        getNetworkAlternativeNames,
        getNetworkAlternativeNamesSchema,
        alternativeNamesSchema
      )(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/network/${config.networkId}/alternative_names`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`alternativeNamesSchema`, () => {
  // Real responses (fixtures/network-alternative-names) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`network-alternative-names`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(alternativeNamesSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
