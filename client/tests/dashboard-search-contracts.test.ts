import assert from "node:assert/strict";
import test from "node:test";

import {
  dashboardSearchQueryKeys,
  normalizeDashboardSearchQuery,
} from "../services/dashboard-search.service";

test("dashboard search normalization trims and collapses whitespace", () => {
  assert.equal(
    normalizeDashboardSearchQuery("  senior   react\tengineer "),
    "senior react engineer",
  );
});

test("dashboard search query keys are stable and include the complete contract", () => {
  const params = { q: "engineer", limitPerCategory: 5 };
  assert.deepEqual(dashboardSearchQueryKeys.all, ["dashboard-search"]);
  assert.deepEqual(dashboardSearchQueryKeys.results(params), [
    "dashboard-search",
    params,
  ]);
});
