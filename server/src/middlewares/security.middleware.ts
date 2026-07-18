import type { RequestHandler } from "express";

export const securityHeaders: RequestHandler = (_req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.removeHeader("X-Powered-By");
  next();
};

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

type ClientWindow = { count: number; resetAt: number };

export const createRateLimiter = ({
  windowMs,
  maxRequests,
}: RateLimitOptions): RequestHandler => {
  const clients = new Map<string, ClientWindow>();

  return (req, res, next) => {
    if (req.method === "OPTIONS") {
      next();
      return;
    }

    const now = Date.now();
    const clientId = req.ip || req.socket.remoteAddress || "unknown";
    let client = clients.get(clientId);

    if (!client || client.resetAt <= now) {
      client = { count: 0, resetAt: now + windowMs };
      clients.set(clientId, client);
    }

    client.count += 1;
    const remaining = Math.max(0, maxRequests - client.count);
    res.setHeader("RateLimit-Limit", maxRequests);
    res.setHeader("RateLimit-Remaining", remaining);
    res.setHeader("RateLimit-Reset", Math.ceil(client.resetAt / 1000));

    if (client.count > maxRequests) {
      res.setHeader("Retry-After", Math.ceil((client.resetAt - now) / 1000));
      res.status(429).json({
        success: false,
        statusCode: 429,
        message: "Too many requests. Please try again later.",
      });
      return;
    }

    if (clients.size > 10_000) {
      for (const [key, value] of clients) {
        if (value.resetAt <= now) clients.delete(key);
      }
    }

    next();
  };
};
