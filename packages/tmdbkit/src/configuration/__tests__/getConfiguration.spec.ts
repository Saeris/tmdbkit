import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import {
  getConfiguration,
  getConfigurationSchema
} from "../getConfiguration.js";
import { configurationSchema } from "../../types/Configuration.js";

describe(`getConfiguration`, { repeats: 5 }, () => {
  const { config, expected } = mockUtils.request.get(
    `/configuration`,
    getConfigurationSchema,
    configurationSchema
  );

  it(`validates input, fetches, and validates output`, async () => {
    await expect(
      toValidated(
        getConfiguration,
        getConfigurationSchema,
        configurationSchema
      )(config)
    ).resolves.toEqual(expected);
  });
});
