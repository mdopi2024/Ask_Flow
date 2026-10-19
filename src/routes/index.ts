import { authRouter } from "@/modules/auth/auth.route";
import { Router } from "express";


const router: Router = Router();

router.use('/auth', authRouter);

export { router }
