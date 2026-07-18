import assert from "node:assert/strict";
import test from "node:test";

import { syncUserSchema } from "../controllers/user.controller.js";

test("public sync accepts only job seeker and employer registration roles", () => {
  assert.deepEqual(syncUserSchema.parse({ role: "job_seeker" }), {
    role: "job_seeker",
  });
  assert.deepEqual(syncUserSchema.parse({ role: "employer" }), {
    role: "employer",
  });

  for (const role of ["admin", "super_admin", "hr_member", "owner"]) {
    assert.equal(syncUserSchema.safeParse({ role }).success, false);
  }
});

test("public sync rejects unexpected registration profile fields", () => {
  assert.equal(
    syncUserSchema.safeParse({ role: "job_seeker", status: "active" }).success,
    false,
  );
});
