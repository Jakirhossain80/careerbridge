import assert from "node:assert/strict";
import test from "node:test";

import { searchDashboard } from "../services/dashboardSearch.service.js";
import type { AuthenticatedFirebaseUser } from "../middlewares/auth.middleware.js";
import { dashboardSearchQuerySchema } from "../validations/dashboardSearch.validation.js";

test("dashboard search validation normalizes and bounds queries", () => {
  assert.deepEqual(
    dashboardSearchQuerySchema.parse({ q: "  senior   engineer  " }),
    { q: "senior engineer", limitPerCategory: 5 },
  );
  assert.equal(dashboardSearchQuerySchema.safeParse({ q: "a" }).success, false);
  assert.equal(
    dashboardSearchQuerySchema.safeParse({ q: "x".repeat(81) }).success,
    false,
  );
  assert.equal(
    dashboardSearchQuerySchema.safeParse({ q: "engineer", limitPerCategory: 9 })
      .success,
    false,
  );
});

test("dashboard search rejects unsupported roles before accessing data", async () => {
  const user = {
    mongoUserId: "507f1f77bcf86cd799439011",
    role: "hr_member",
  } as AuthenticatedFirebaseUser;

  await assert.rejects(
    () => searchDashboard(user, { q: "engineer", limitPerCategory: 5 }),
    /not available for this role/i,
  );
});

test("dashboard search requires a synchronized MongoDB user", async () => {
  await assert.rejects(
    () => searchDashboard(undefined, { q: "engineer", limitPerCategory: 5 }),
    /profile is required/i,
  );
});
