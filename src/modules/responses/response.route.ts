import { Router } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import validateRequest from "@/middleware/zod.validate";
import { checkAuth } from "@/middleware/session.middleware";

import responseValidator from "./response.validator";
import { responseController } from "./response.controller";

const router: Router = Router();

const publicCors = cors({ origin: true, methods: ["POST", "OPTIONS"] });

const submitLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

// PUBLIC (no auth): respondents can only submit
router.options('/public/:slug', publicCors)
router.post('/public/:slug', publicCors, submitLimiter, validateRequest(responseValidator.submitResponseSchema), responseController.submitResponse)

// OWNER (auth required): dashboard
router.get('/:formId', checkAuth(), validateRequest(responseValidator.listResponsesQuerySchema), responseController.getResponsesByFormId)
router.get('/:id', checkAuth(), responseController.getResponseById)
router.delete('/:id', checkAuth(), responseController.deleteResponse)

export const responseRouter = router