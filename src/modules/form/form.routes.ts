import { Router } from "express";
import { formController } from "./form.controller";
import validateRequest from "@/middleware/zod.validate";
import formValidator from "./form.validator";
import { checkAuth } from "@/middleware/session.middleware";




const router: Router = Router();

router.post("/create", checkAuth(), validateRequest(formValidator.createFormSchema), formController.createForm);
router.get("/", checkAuth(), formController.getFormsByOwnerId);
router.get("/:id", checkAuth(), formController.getFormById);


export const formRouter = router
