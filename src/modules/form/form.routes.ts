import { Router } from "express";
import { formController } from "./form.controller";
import validateRequest from "@/middleware/zod.validate";
import formValidator from "./form.validator";
import { checkAuth } from "@/middleware/session.middleware";




const router: Router = Router();

router.post("/create", checkAuth(), validateRequest(formValidator.createFormSchema), formController.createForm);


export const formRouter = router
