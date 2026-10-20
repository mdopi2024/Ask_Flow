import { authRouter } from "@/modules/auth/auth.route";
import { formRouter } from "@/modules/form/form.routes";
import { questionRouter } from "@/modules/questions/question.route";
import { Router } from "express";


const router: Router = Router();

router.use('/auth', authRouter);
router.use('/form', formRouter);
router.use('/questions', questionRouter);

export { router }
