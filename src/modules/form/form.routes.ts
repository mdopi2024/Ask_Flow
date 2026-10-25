import { Router } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { formController } from "./form.controller";
import validateRequest from "@/middleware/zod.validate";
import formValidator from "./form.validator";
import { checkAuth } from "@/middleware/session.middleware";

const router: Router = Router();

// ---------- Public (widget অন্য site থেকে call করবে) ----------
const publicCors = cors({ origin: true, methods: ["GET", "OPTIONS"] });

const readLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
});

router.options("/public/:slug", publicCors);
router.get("/public/:slug", publicCors, readLimiter, formController.getPublicForm);

// ---------- Owner (auth সহ) ----------
router.post("/", checkAuth(), validateRequest(formValidator.createFormSchema), formController.createForm);
router.get("/", checkAuth(), formController.getFormsByOwnerId);
router.get("/:id", checkAuth(), formController.getFormById);
router.patch("/:id", checkAuth(), validateRequest(formValidator.updateFormSchema), formController.updateForm);
router.delete("/:id", checkAuth(), formController.deleteForm);

export const formRouter = router;