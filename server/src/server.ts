import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const startServer = async () => {
  await connectDB();

  app.listen(env.port, "0.0.0.0", () => {
    console.log(`CareerBridge server is running on port ${env.port}`);
  });
};

startServer();
