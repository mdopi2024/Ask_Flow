import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../config/prisma";
import { env } from "../config/env";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: false,
      },
      isDeleted: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  trustedOrigins: [env.FRONTEND_URL],
  plugins: [bearer()],
});

export type Auth = typeof auth;