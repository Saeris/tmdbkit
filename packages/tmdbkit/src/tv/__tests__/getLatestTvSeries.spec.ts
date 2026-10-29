import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { getLatestTvSeries } from "../getLatestTvSeries.js";
import { tvSeriesDetailsSchema } from "../types/TvSeriesDetails.js";

describe(`getLatestTvSeries`, { repeats: 5 }, () => {
  const { expected, requests } = mockUtils.request.get(
    `/tv/latest`,
    null,
    tvSeriesDetailsSchema
  );

  it(`sends GET /tv/latest and resolves the validated response`, async () => {
    await expect(
      toValidated(getLatestTvSeries, null, tvSeriesDetailsSchema)()
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/tv/latest`);
  });
});

// No recorded fixture: the `latest` endpoints return whatever was created last, which may be adult content. The response shares tvSeriesDetailsSchema with the details endpoint, whose fixtures are checked there.
