import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  readPublicJobParams,
  updatePublicJobParams,
  writePublicJobParams,
} from "../lib/public-job-search";
import {
  formatSalary,
  normalizeJob,
  publicJobQueryKeys,
} from "../services/jobs.service";
import type { Job } from "../types/job.types";

test("public URL parameters normalize supported values and omit defaults", () => {
  const params = readPublicJobParams(new URLSearchParams("keyword=%20react%20%20engineer%20&jobType=full_time&workMode=remote&page=2&salaryMin=50000"));
  assert.deepEqual(params, { keyword: "react engineer", jobType: "full_time", workMode: "remote", page: 2, salaryMin: 50000 });
  assert.equal(writePublicJobParams({ page: 1, keyword: "React", featured: false }).toString(), "keyword=React");
});

test("filter changes reset pagination while page changes preserve it", () => {
  assert.deepEqual(updatePublicJobParams({ page: 4, keyword: "React" }, { location: "  Dhaka   Bangladesh " }), { keyword: "React", location: "Dhaka Bangladesh" });
  assert.deepEqual(updatePublicJobParams({ page: 4, keyword: "React" }, { page: 2 }, false), { page: 2, keyword: "React" });
});

test("public job query keys are stable and fully parameter scoped", () => {
  const params = { page: 2, keyword: "React" };
  assert.deepEqual(publicJobQueryKeys.list(params), ["public-jobs", "list", params]);
  assert.deepEqual(publicJobQueryKeys.featured(params), ["public-jobs", "featured", params]);
});

test("salary normalization prefers canonical fields and supports nested legacy fields", () => {
  const base = { id: "1", title: "Role", category: "Engineering", jobType: "full_time", skills: [], description: "", responsibilities: [], requirements: [], status: "active" } as Job;
  const normalized = normalizeJob({ ...base, salary: { min: 50000, max: 70000, currency: "USD", negotiable: false } });
  assert.equal(normalized.salaryMin, 50000);
  assert.equal(normalized.salaryMax, 70000);
  assert.equal(formatSalary(normalized), "$50,000 - $70,000");
  assert.equal(formatSalary({ ...base, salary: { negotiable: false } }), "Salary not specified");
});

test("public service has no employer fallback or mock runtime imports", () => {
  const servicePath = fileURLToPath(new URL("../services/jobs.service.ts", import.meta.url));
  const source = readFileSync(servicePath, "utf8");
  assert.equal(source.includes('api.get<ApiEnvelope<EmployerJobsResponse>>(\n      "/employer/jobs"'), false);
  assert.equal(source.includes("?? fallbackJobs"), false);
  assert.equal(source.includes('"/api/v1/jobs"'), false);
});
