import { authRouter } from "@/modules/auth/auth.route";
import { formRouter } from "@/modules/form/form.routes";
import { Router } from "express";


const router: Router = Router();

router.use('/auth', authRouter);
router.use('/form', formRouter);

export { router }
