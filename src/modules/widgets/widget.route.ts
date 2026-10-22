import { Router } from "express";
import validateRequest from "@/middleware/zod.validate";
import { checkAuth } from "@/middleware/session.middleware";
import widgetSettingsValidator from "./widget.validator";
import { widgetControllers } from "./widget.controller";

const router: Router = Router();

router.patch("/:formId", checkAuth(), validateRequest(widgetSettingsValidator.updateWidgetSettingsSchema), widgetControllers.updateWidgetSettings);

export const widgetRouter = router;