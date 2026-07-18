import assert from "node:assert/strict";
import test from "node:test";
import { defaultSettings } from "../components/admin/settings/SystemSettingsPage";
import { adminSettingsSchema } from "../lib/validations/admin-settings.schema";
import { normalizeApplicationsResponse } from "../services/applications.service";
import { notificationQueryKeys } from "../services/notifications.service";

test("admin settings schema converts form inputs to the canonical output", () => {
  const result = adminSettingsSchema.parse({
    ...defaultSettings,
    security: {
      ...defaultSettings.security,
      sessionTimeoutMinutes: "90",
      loginAttemptLimit: "4",
      minimumPasswordLength: "12",
    },
  });

  assert.equal(result.security.sessionTimeoutMinutes, 90);
  assert.equal(result.security.loginAttemptLimit, 4);
  assert.equal(result.security.minimumPasswordLength, 12);
  assert.equal(typeof result.security.sessionTimeoutMinutes, "number");
});

test("admin settings schema preserves validation failures", () => {
  const result = adminSettingsSchema.safeParse({
    ...defaultSettings,
    security: {
      ...defaultSettings.security,
      sessionTimeoutMinutes: "not-a-number",
    },
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0]?.path.join("."), "security.sessionTimeoutMinutes");
  }
});

const application = {
  _id: "application-1",
  status: "applied" as const,
  applicantName: "Candidate",
};

for (const pagination of [
  { label: "first", page: 1, totalPages: 3, total: 25, count: 10 },
  { label: "middle", page: 2, totalPages: 3, total: 25, count: 10 },
  { label: "last", page: 3, totalPages: 3, total: 25, count: 5 },
  { label: "empty", page: 1, totalPages: 1, total: 0, count: 0 },
]) {
  test(`normalizes ${pagination.label} application pagination`, () => {
    const result = normalizeApplicationsResponse({
      applications: Array.from({ length: pagination.count }, (_, index) => ({
        ...application,
        _id: `application-${index + 1}`,
      })),
      meta: {
        page: pagination.page,
        limit: 10,
        total: pagination.total,
        totalPages: pagination.totalPages,
      },
    });

    assert.equal(result.applications.length, pagination.count);
    assert.equal(result.page, pagination.page);
    assert.equal(result.total, pagination.total);
    assert.equal(result.totalPages, pagination.totalPages);
  });
}

test("rejects malformed application pagination instead of inventing metadata", () => {
  assert.throws(() =>
    normalizeApplicationsResponse({
      applications: [],
      meta: { page: 0, limit: 0, total: -1, totalPages: 0 },
    })
  );
});

test("notification query keys are stable and scope list filters", () => {
  const filters = { page: 2, limit: 10, status: "unread" as const };

  assert.deepEqual(notificationQueryKeys.all, ["notifications"]);
  assert.deepEqual(notificationQueryKeys.list(filters), ["notifications", filters]);
  assert.deepEqual(notificationQueryKeys.detail("notification-1"), [
    "notification",
    "notification-1",
  ]);
});
