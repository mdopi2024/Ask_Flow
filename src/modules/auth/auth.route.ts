import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { authController } from "./auth.controller";
import validateRequest from "@/middleware/zod.validate";
import authValidator from "./auth.validator";
import { checkAuth } from "@/middleware/session.middleware";
import { Role } from "@/generated/prisma/enums";

const router: Router = Router();

interface LimiterOptions {
    windowMs: number;
    limit: number;
    message: string;
    skipSuccessfulRequests?: boolean;
}

const createLimiter = ({ windowMs, limit, message, skipSuccessfulRequests = false }: LimiterOptions) =>
    rateLimit({
        windowMs,
        limit,
        skipSuccessfulRequests,
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message },
    });

const signUpLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: "Too many accounts created, please try again after an hour",
});

const signInLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: "Too many login attempts, please try again after 15 minutes",
    skipSuccessfulRequests: true,
});

const adminLimiter = createLimiter({
    windowMs: 60 * 1000,
    limit: 30,
    message: "Too many requests, please slow down",
});

router.post("/signup", signUpLimiter, validateRequest(authValidator.createUserSchema), authController.signUpUser);
router.post("/signin", signInLimiter, validateRequest(authValidator.loginUserSchema), authController.loginUser);
router.post("/signout", checkAuth(), authController.logoutUser);

router.get(
    "/users",
    adminLimiter,
    checkAuth(Role.ADMIN),
    validateRequest(authValidator.getAllUsersQuerySchema),
    authController.getAllUsers
);

router.patch(
    "/user/:id",
    adminLimiter,
    checkAuth(Role.ADMIN),
    validateRequest(authValidator.updateUserRoleSchema),
    authController.updateUserRole
);

export const authRouter = router;