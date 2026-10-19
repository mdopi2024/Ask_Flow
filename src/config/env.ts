import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

type NodeEnv = "development" | "production" | "test";

interface EnvConfig {
  NODE_ENV: NodeEnv;
  PORT: number;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  FRONTEND_URL: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ADMIN_NAME: string;
  isDev: () => boolean;
  isProd: () => boolean;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getNodeEnv(): NodeEnv {
  const value = process.env.NODE_ENV;
  return value === "production" || value === "test" ? value : "development";
}

const NODE_ENV = getNodeEnv();

export const env: EnvConfig = {
  NODE_ENV,
  PORT: Number(process.env.PORT) || 5000,

  DATABASE_URL: requireEnv("DATABASE_URL"),

  BETTER_AUTH_SECRET: requireEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: requireEnv("BETTER_AUTH_URL"),

  ADMIN_EMAIL: requireEnv("ADMIN_EMAIL"),
  ADMIN_PASSWORD: requireEnv("ADMIN_PASSWORD"),
  ADMIN_NAME: requireEnv("ADMIN_NAME"),

  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:3000",
  isDev: () => NODE_ENV === "development",
  isProd: () => NODE_ENV === "production",

};