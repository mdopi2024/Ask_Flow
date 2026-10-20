import { Router } from "express";
import validateRequest from "@/middleware/zod.validate";
import { checkAuth } from "@/middleware/session.middleware";

import questionValidator from "./question.validator";
import questionController from "./quetion.controller";



const router: Router = Router();

router.post('/:formId', checkAuth(), validateRequest(questionValidator.createQuestionSchema), questionController.createQuestion)
router.get('/:formId', checkAuth(), questionController.getQuestionsByFormId)


export const questionRouter = router
