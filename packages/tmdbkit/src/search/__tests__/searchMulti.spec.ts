import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { searchMulti, searchMultiSchema } from "../searchMulti.js";
import { pagedResults } from "../../types/PagedResults.js";
import { searchMultiResultSchema } from "../types/SearchMultiResult.js";

describe(`searchMulti`, { repeats: 5 }, () => {
  const { config, expected } = mockUtils.request.get(
    `/search/multi`,
    searchMultiSchema,
    pagedResults(searchMultiResultSchema)
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(
        searchMulti,
        searchMultiSchema,
        pagedResults(searchMultiResultSchema)
      )(config)
    ).resolves.toEqual(expected);
  });
});
