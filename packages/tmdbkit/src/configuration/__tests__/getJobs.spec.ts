import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { mockUtils } from "#mocks";
import { fixtures } from "#fixtures";
import { toValidated } from "../../requests/toValidated.js";
import { getJobs } from "../getJobs.js";
import { departmentJobsSchema } from "../types/DepartmentJobs.js";

describe(`getJobs`, { repeats: 5 }, () => {
  const { expected, requests } = mockUtils.request.get(
    `/configuration/jobs`,
    null,
    departmentJobsSchema
  );

  it(`sends GET /configuration/jobs and resolves the validated response`, async () => {
    await expect(
      toValidated(getJobs, null, departmentJobsSchema)()
    ).resolves.toEqual(expected);
    const sent = new URL(requests.at(-1)?.url ?? ``);
    expect(decodeURIComponent(sent.pathname)).toBe(`/3/configuration/jobs`);
  });
});

describe(`departmentJobsSchema`, () => {
  // Real responses (fixtures/configuration-jobs) are what catch a wrong nullability; generated mocks only ever match the schema.
  it.each(fixtures(`configuration-jobs`))(
    `accepts TMDB's recorded response: $label`,
    ({ body }) => {
      const result = v.safeParse(departmentJobsSchema, body);
      // On failure the diff shows Valibot's summary of every issue.
      expect(result.issues && v.summarize(result.issues)).toBeUndefined();
    }
  );
});
