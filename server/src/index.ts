import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { healthRouter } from "./routes/health";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.use("/api/health", healthRouter);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});
