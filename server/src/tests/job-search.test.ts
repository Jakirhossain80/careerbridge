import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";

import { publicCompanyVisibilityFilter } from "../services/company.service.js";
import {
  buildPublicJobFilter,
  publicJobProjection,
  tokenizeGlobalSearch,
} from "../services/job.service.js";
import { publicJobsQuerySchema } from "../validations/job.validation.js";

const companyId = new Types.ObjectId();

const parse = (query: Record<string, unknown> = {}) =>
  publicJobsQuerySchema.parse(query);

test("public job validation normalizes text and applies safe defaults", () => {
  const result = parse({ search: "  senior   react engineer  " });
  assert.equal(result.search, "senior react engineer");
  assert.equal(result.page, 1);
  assert.equal(result.limit, 12);
  assert.equal(result.sort, "-createdAt");
});

test("public job validation rejects excessive text and invalid ranges", () => {
  assert.equal(publicJobsQuerySchema.safeParse({ search: "x".repeat(121) }).success, false);
  assert.equal(publicJobsQuerySchema.safeParse({ salaryMin: 100, salaryMax: 50 }).success, false);
  assert.equal(publicJobsQuerySchema.safeParse({ page: 0, limit: 101 }).success, false);
});

test("global search is bounded and tokenized", () => {
  assert.deepEqual(tokenizeGlobalSearch("one two three four five six seven eight nine"), [
    "one", "two", "three", "four", "five", "six", "seven", "eight",
  ]);
});

test("field-specific search remains scoped and regex input is escaped", () => {
  const filter = buildPublicJobFilter(parse({
    title: "React.*",
    company: "Acme",
    skill: "SQL",
  }), [companyId]);

  assert.equal(String(filter.title), "/React\\.\\*/i");
  assert.equal(String(filter.companyName), "/Acme/i");
  assert.equal(String(filter.skills), "/SQL/i");
});

test("global tokens each search only the approved broad fields", () => {
  const filter = buildPublicJobFilter(parse({ keyword: "senior react" }), [companyId]);
  const clauses = filter.$and ?? [];
  assert.equal(clauses.length, 2);
  for (const clause of clauses) {
    assert.deepEqual(Object.keys(clause.$or?.[0] ?? {}), ["title"]);
    assert.equal(clause.$or?.length, 6);
  }
});

test("supported filters and approved company IDs compose in one filter", () => {
  const filter = buildPublicJobFilter(parse({
    category: "Engineering",
    location: "Dhaka",
    jobType: "full_time",
    workMode: "remote",
    experienceLevel: "Senior",
    featured: "true",
    salaryMin: "50000",
    salaryMax: "100000",
    currency: "USD",
  }), [companyId]);
  assert.deepEqual(filter.companyId, { $in: [companyId] });
  assert.equal(filter.jobType, "full_time");
  assert.equal(filter.workMode, "remote");
  assert.equal(filter.featured, true);
  assert.ok((filter.$and?.length ?? 0) >= 3);
});

test("an explicitly requested non-public company produces no eligible IDs", () => {
  const filter = buildPublicJobFilter(parse({ companyId: new Types.ObjectId().toString() }), [companyId]);
  assert.deepEqual(filter.companyId, { $in: [] });
});

test("company visibility requires approved status with legacy fallback", () => {
  assert.deepEqual(publicCompanyVisibilityFilter.$or, [
    { status: "approved" },
    { status: { $exists: false }, verificationStatus: "approved" },
  ]);
});

test("public job projection excludes employer, moderation, and version fields", () => {
  assert.equal("employerId" in publicJobProjection, false);
  assert.equal("employerEmail" in publicJobProjection, false);
  assert.equal("status" in publicJobProjection, false);
  assert.equal("__v" in publicJobProjection, false);
  assert.equal(publicJobProjection.title, 1);
  assert.equal(publicJobProjection.companyId, 1);
});
