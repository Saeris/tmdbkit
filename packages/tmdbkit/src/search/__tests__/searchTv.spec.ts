import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { searchTv, searchTvSchema } from "../searchTv.js";
import { pagedResults } from "../../types/PagedResults.js";
import { searchTvResultSchema } from "../types/SearchTvResult.js";

describe(`searchTv`, { repeats: 5 }, () => {
  const { config, expected } = mockUtils.request.get(
    `/search/tv`,
    searchTvSchema,
    pagedResults(searchTvResultSchema)
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(
        searchTv,
        searchTvSchema,
        pagedResults(searchTvResultSchema)
      )(config)
    ).resolves.toEqual(expected);
  });
});
