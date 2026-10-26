import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { searchPerson, searchPersonSchema } from "../searchPerson.js";
import { pagedResults } from "../../types/PagedResults.js";
import { searchPersonResultSchema } from "../types/SearchPersonResult.js";

describe(`searchPerson`, { repeats: 5 }, () => {
  const { config, expected } = mockUtils.request.get(
    `/search/person`,
    searchPersonSchema,
    pagedResults(searchPersonResultSchema)
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(
        searchPerson,
        searchPersonSchema,
        pagedResults(searchPersonResultSchema)
      )(config)
    ).resolves.toEqual(expected);
  });
});
