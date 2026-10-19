// src/middleware/auth.middleware.ts
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../lib/auth";

import type { AuthUser } from "../types/express";
import { Role } from "@/generated/prisma/enums";


const toAuthUser = (user: {
  id: string;
  name: string;
  email: string;
  isDeleted?: boolean | null;
  role?: string | null;
}): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  isDeleted: user.isDeleted ?? false,
  role: (user.role as Role) ?? Role.USER,
});

const sendError = (res: Response, code: number, message: string) =>
  res.status(code).json({ success: false, message });

export const checkAuth = (roles: Role[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        return sendError(res, status.UNAUTHORIZED, "Unauthorized access");
      }

      const user = toAuthUser(session.user);

      if (user.isDeleted) {
        return sendError(res, status.FORBIDDEN, "This account has been deleted");
      }


      if (roles.length > 0 && !roles.includes(user.role)) {
        return sendError(
          res,
          status.FORBIDDEN,
          "You do not have permission to access this resource"
        );
      }
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};