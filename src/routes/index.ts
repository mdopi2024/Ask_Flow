import { authRouter } from "@/modules/auth/auth.route";
import { formRouter } from "@/modules/form/form.routes";
import { questionRouter } from "@/modules/questions/question.route";
import { responseRouter } from "@/modules/responses/response.route";
import { Router } from "express";


const router: Router = Router();

router.use('/auth', authRouter);
router.use('/form', formRouter);
router.use('/questions', questionRouter);
router.use('/responses', responseRouter);

export { router }
