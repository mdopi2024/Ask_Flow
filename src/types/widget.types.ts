import { z } from "zod";
import { widgetSettingsSchema } from "@/modules/widgets/widget.validator";

export type WidgetSettingsInput = z.infer<typeof widgetSettingsSchema>;