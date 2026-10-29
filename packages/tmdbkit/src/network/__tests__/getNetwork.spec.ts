import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures, expectedQuery } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getNetwork, getNetworkSchema } from "../getNetwork.js";
import { networkDetailsSchema } from "../types/NetworkDetails.js";

describe(`getNetwork`, { repeats: 5 }, () => {
  const { config, expected, requests } = mockUtils.request.get(
    `/network/:networkId`,
    getNetworkSchema,
    networkDetailsSchema
  );

  it(`sends GET /network/{network_id} and resolves the validated response`, async () => {
    await expect(
      toValidated(getNetwork, getNetworkSchema, networkDetailsSchema)(config)
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(
      `/3/network/${config.networkId}`
    );
    expect(Object.fromEntries(sent.searchParams)).toEqual(expectedQuery({}));
  });
});

describe(`networkDetailsSchema`, () => {
  // Real responses (fixtures/network-details) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`network-details`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(networkDetailsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
