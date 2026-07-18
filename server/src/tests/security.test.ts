import assert from "node:assert/strict";
import { once } from "node:events";
import http from "node:http";
import test from "node:test";
import express, {
  type Express,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { createApp } from "../app.js";
import { USER_STATUS } from "../constants/model.constants.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import type { AuthenticatedFirebaseUser } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";
import {
  createUploadMiddleware,
  uploadAvatarFile,
  uploadAllowedTypes,
  uploadCompanyBannerFile,
  uploadCompanyLogoFile,
  uploadResumeFile,
  validateResumeFileContents,
} from "../middlewares/upload.middleware.js";

type LocalResponse = {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
};

const request = async (
  app: Express,
  path: string,
  options: {
    method?: string;
    headers?: Record<string, string | number>;
    body?: Buffer | string;
  } = {}
): Promise<LocalResponse> => {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert(address && typeof address === "object");

  try {
    return await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port: address.port,
          path,
          method: options.method ?? "GET",
          headers: options.headers,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
          res.on("end", () =>
            resolve({
              status: res.statusCode ?? 0,
              headers: res.headers,
              body: Buffer.concat(chunks).toString("utf8"),
            })
          );
        }
      );
      req.on("error", reject);
      if (options.body) req.write(options.body);
      req.end();
    });
  } finally {
    server.close();
    await once(server, "close");
  }
};

const multipartBody = (
  fieldName: string,
  filename: string,
  mimeType: string,
  contents: Buffer
) => {
  const boundary = "careerbridge-test-boundary";
  const before = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`
  );
  const after = Buffer.from(`\r\n--${boundary}--\r\n`);
  return {
    body: Buffer.concat([before, contents, after]),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
};

const uploadApp = (
  middleware: RequestHandler | RequestHandler[],
  onAccepted: RequestHandler
) => {
  const app = express();
  app.post("/upload", ...(Array.isArray(middleware) ? middleware : [middleware]), onAccepted);
  app.use(errorHandler);
  return app;
};

test("valid image and resume uploads reach the next application layer", async () => {
  for (const upload of [
    {
      field: "avatar",
      filename: "avatar.jpg",
      mime: "image/jpeg",
      middleware: uploadAvatarFile,
    },
    {
      field: "logo",
      filename: "logo.png",
      mime: "image/png",
      middleware: uploadCompanyLogoFile,
    },
    {
      field: "banner",
      filename: "banner.webp",
      mime: "image/webp",
      middleware: uploadCompanyBannerFile,
    },
    {
      field: "resume",
      filename: "resume.pdf",
      mime: "application/pdf",
      middleware: [uploadResumeFile, validateResumeFileContents],
    },
  ]) {
    let reachedHandler = false;
    const multipart = multipartBody(
      upload.field,
      upload.filename,
      upload.mime,
      Buffer.from(upload.field === "resume" ? "%PDF-1.7 safe-test" : "safe-test-file")
    );
    const response = await request(
      uploadApp(upload.middleware, (req, res) => {
        reachedHandler = Boolean(req.file);
        res.status(204).end();
      }),
      "/upload",
      {
        method: "POST",
        headers: {
          "Content-Type": multipart.contentType,
          "Content-Length": multipart.body.length,
        },
        body: multipart.body,
      }
    );

    assert.equal(response.status, 204);
    assert.equal(reachedHandler, true);
  }
});

test("unsupported and spoofed upload combinations return 415", async () => {
  for (const file of [
    { filename: "avatar.gif", mime: "image/gif" },
    { filename: "avatar.pdf", mime: "image/jpeg" },
    { filename: "avatar.jpg", mime: "application/pdf" },
  ]) {
    const multipart = multipartBody(
      "avatar",
      file.filename,
      file.mime,
      Buffer.from("not-an-image")
    );
    const response = await request(
      uploadApp(
        createUploadMiddleware({
          fieldName: "avatar",
          maxBytes: 1024,
          allowedTypes: uploadAllowedTypes.imageTypes,
        }),
        (_req, res) => res.status(204).end()
      ),
      "/upload",
      {
        method: "POST",
        headers: {
          "Content-Type": multipart.contentType,
          "Content-Length": multipart.body.length,
        },
        body: multipart.body,
      }
    );

    assert.equal(response.status, 415);
    assert.equal(JSON.parse(response.body).success, false);
  }
});

test("matching resume MIME and extension with spoofed contents returns 415", async () => {
  const multipart = multipartBody(
    "resume",
    "resume.pdf",
    "application/pdf",
    Buffer.from("not a PDF")
  );
  const response = await request(
    uploadApp(
      [uploadResumeFile, validateResumeFileContents],
      (_req, res) => res.status(204).end()
    ),
    "/upload",
    {
      method: "POST",
      headers: {
        "Content-Type": multipart.contentType,
        "Content-Length": multipart.body.length,
      },
      body: multipart.body,
    }
  );
  assert.equal(response.status, 415);
});

test("oversized uploads return the centralized 413 response", async () => {
  const multipart = multipartBody(
    "avatar",
    "avatar.png",
    "image/png",
    Buffer.alloc(16)
  );
  const response = await request(
    uploadApp(
      createUploadMiddleware({
        fieldName: "avatar",
        maxBytes: 8,
        allowedTypes: uploadAllowedTypes.imageTypes,
      }),
      (_req, res) => res.status(204).end()
    ),
    "/upload",
    {
      method: "POST",
      headers: {
        "Content-Type": multipart.contentType,
        "Content-Length": multipart.body.length,
      },
      body: multipart.body,
    }
  );

  assert.equal(response.status, 413);
  assert.equal(JSON.parse(response.body).statusCode, 413);
});

test("oversized JSON returns 413 and security headers are present", async () => {
  const body = JSON.stringify({ value: "x".repeat(256) });
  const response = await request(
    createApp({ jsonBodyLimit: "100b" }),
    "/api/v1/jobs",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": body.length },
      body,
    }
  );

  assert.equal(response.status, 413);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.equal(JSON.parse(response.body).statusCode, 413);
});

test("rate limiting returns 429 without making public endpoints unavailable", async () => {
  const app = createApp({ rateLimitMaxRequests: 2, rateLimitWindowMs: 60_000 });
  assert.equal((await request(app, "/api/v1/health")).status, 200);
  assert.equal((await request(app, "/api/v1/health")).status, 200);
  const limited = await request(app, "/api/v1/health");
  assert.equal(limited.status, 429);
  assert.equal(JSON.parse(limited.body).statusCode, 429);
});

test("auth-test routes are absent in production", async () => {
  const response = await request(
    createApp({ nodeEnv: "production" }),
    "/api/v1/auth-test/protected"
  );
  assert.equal(response.status, 404);
});

test("protected development test routes reject unauthenticated requests", async () => {
  const response = await request(
    createApp({ nodeEnv: "test" }),
    "/api/v1/auth-test/protected"
  );
  assert.equal(response.status, 401);
});

const runMiddleware = (
  middleware: RequestHandler,
  user?: Partial<AuthenticatedFirebaseUser>
) => {
  let nextCalled = false;
  let statusCode = 200;
  const req = { user: user as AuthenticatedFirebaseUser | undefined } as Request;
  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json() {
      return this;
    },
  } as unknown as Response;
  middleware(req, res, () => {
    nextCalled = true;
  });
  return { nextCalled, statusCode };
};

test("role and account-status guards reject invalid users and accept valid users", () => {
  assert.equal(runMiddleware(allowRoles("employer")).statusCode, 403);
  assert.equal(
    runMiddleware(allowRoles("employer"), { uid: "test", role: "job_seeker" }).statusCode,
    403
  );

  for (const status of [
    USER_STATUS.BLOCKED,
    USER_STATUS.PENDING,
    USER_STATUS.SUSPENDED,
  ]) {
    const result = runMiddleware(checkUserStatus, { uid: "test", status });
    assert.equal(result.statusCode, 403);
    assert.equal(result.nextCalled, false);
  }

  const validRole = runMiddleware(allowRoles("employer"), {
    uid: "test",
    role: "employer",
  });
  const validStatus = runMiddleware(checkUserStatus, {
    uid: "test",
    status: USER_STATUS.ACTIVE,
  });
  assert.equal(validRole.nextCalled, true);
  assert.equal(validStatus.nextCalled, true);
});
