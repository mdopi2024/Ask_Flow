import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";

import { env } from "./config/env";
import { auth } from "./lib/auth";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { router } from "./routes";



const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan(env.isDev() ? "dev" : "combined"));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Formly Chat Backend");
});
app.get("/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Server is healthy 🚀" });
});

app.use("/api/v1", router)

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
