import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { createRateLimiter, securityHeaders } from "./middlewares/security.middleware.js";
import { createApiRouter } from "./routes/index.js";

type AppOptions = {
  nodeEnv?: typeof env.nodeEnv;
  jsonBodyLimit?: string;
  rateLimitWindowMs?: number;
  rateLimitMaxRequests?: number;
};

export const createApp = (options: AppOptions = {}) => {
  const app = express();
  const nodeEnv = options.nodeEnv ?? env.nodeEnv;

  if (env.trustProxyHops > 0) {
    app.set("trust proxy", env.trustProxyHops);
  }

  app.use(securityHeaders);
  app.use(
    createRateLimiter({
      windowMs: options.rateLimitWindowMs ?? env.rateLimitWindowMs,
      maxRequests: options.rateLimitMaxRequests ?? env.rateLimitMaxRequests,
    })
  );

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );

  app.use(express.json({ limit: options.jsonBodyLimit ?? env.jsonBodyLimit }));
  app.use(cookieParser());

  app.get("/", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "CareerBridge API is running",
    });
  });

  app.use("/api/v1", createApiRouter(nodeEnv));

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

const app = createApp();
export default app;
