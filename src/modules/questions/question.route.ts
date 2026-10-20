import { Router } from "express";
import validateRequest from "@/middleware/zod.validate";
import { checkAuth } from "@/middleware/session.middleware";

import questionValidator from "./question.validator";
import questionController from "./quetion.controller";



const router: Router = Router();

router.post('/:formId', checkAuth(), validateRequest(questionValidator.createQuestionSchema), questionController.createQuestion)


export const questionRouter = router
