import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CareerBridge API is running",
  });
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
