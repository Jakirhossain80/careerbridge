import assert from "node:assert/strict";
import test from "node:test";

import { notificationsQuerySchema } from "../validations/notification.validation.js";

test("notification query validation applies safe pagination defaults", () => {
  assert.deepEqual(notificationsQuerySchema.parse({}), {
    page: 1,
    limit: 20,
  });
});

test("notification query validation coerces supported filters", () => {
  assert.deepEqual(
    notificationsQuerySchema.parse({ page: "2", limit: "25", read: "true" }),
    { page: 2, limit: 25, read: true },
  );
});

test("notification query validation rejects abusive pagination", () => {
  assert.equal(notificationsQuerySchema.safeParse({ page: 0 }).success, false);
  assert.equal(notificationsQuerySchema.safeParse({ limit: 101 }).success, false);
});
