import * as v from "valibot";
import { schema } from "../../validations/schema.js";

const _departmentSchema = v.object({
  department: v.string(),
  jobs: v.array(v.string())
});

export interface Department extends v.InferOutput<typeof _departmentSchema> {}

export type DepartmentJobs = Department[];

/**
 * ### Jobs
 *
 * Every crew department and the jobs in it (`getJobs`): the values crew credits use for `department` and `job`.
 */
export const departmentJobsSchema = schema<DepartmentJobs>(
  v.array(schema<Department>(_departmentSchema))
);
