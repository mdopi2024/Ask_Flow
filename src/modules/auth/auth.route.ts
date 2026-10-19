
import { Router } from "express";
import { authController } from "./auth.controller";
import validateRequest from "@/middleware/zod.validate";
import authValidator from "./auth.validator";
import { checkAuth } from "@/middleware/session.middleware";



const router: Router = Router();

router.post("/signup", validateRequest(authValidator.createUserSchema), authController.signUpUser);
router.post("/signin", validateRequest(authValidator.loginUserSchema), authController.loginUser);
router.post("/signout", checkAuth(), authController.logoutUser);

export const authRouter = router
