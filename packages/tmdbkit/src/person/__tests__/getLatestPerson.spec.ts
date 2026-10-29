import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { toValidated } from "../../requests/toValidated.js";
import { getLatestPerson } from "../getLatestPerson.js";
import { personDetailsSchema } from "../types/PersonDetails.js";

describe(`getLatestPerson`, { repeats: 5 }, () => {
  const { expected, requests } = mockUtils.request.get(
    `/person/latest`,
    null,
    personDetailsSchema
  );

  it(`sends GET /person/latest and resolves the validated response`, async () => {
    await expect(
      toValidated(getLatestPerson, null, personDetailsSchema)()
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/person/latest`);
  });
});

// No recorded fixture: the `latest` endpoints return whatever was created last, which may be adult content. The response shares personDetailsSchema with the details endpoint, whose fixtures are checked there.
