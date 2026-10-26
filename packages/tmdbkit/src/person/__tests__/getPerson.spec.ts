import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { getPerson, getPersonSchema } from "../getPerson.js";
import { personSchema } from "../../types/Person.js";

describe(`getPerson`, { repeats: 5 }, () => {
  const { config, expected } = mockUtils.request.get(
    `/person/:personId`,
    getPersonSchema,
    personSchema
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(getPerson, getPersonSchema, personSchema)(config)
    ).resolves.toEqual(expected);
  });
});
