import { Router } from "express";
import { formController } from "./form.controller";
import validateRequest from "@/middleware/zod.validate";
import formValidator from "./form.validator";
import { checkAuth } from "@/middleware/session.middleware";




const router: Router = Router();

router.post("/create", checkAuth(), validateRequest(formValidator.createFormSchema), formController.createForm);
router.get("/", checkAuth(), formController.getFormsByOwnerId);
router.get("/:id", checkAuth(), formController.getFormById);
router.patch("/update/:id", checkAuth(), validateRequest(formValidator.updateFormSchema), formController.updateForm);
router.delete("/delete/:id", checkAuth(), formController.deleteForm);




export const formRouter = router
