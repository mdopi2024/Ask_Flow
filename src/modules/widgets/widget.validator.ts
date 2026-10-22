// widget.validator.ts
import { z } from "zod";

const hexColor = z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Must be a valid hex color (e.g. #4F46E5)");

const domain = z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^(?!-)([a-z0-9-]+\.)+[a-z]{2,}$/, "Invalid domain (e.g. example.com)");

export const widgetSettingsSchema = z
    .object({
        botName: z.string().trim().min(1, "Bot name is required").max(50),
        primaryColor: hexColor,
        backgroundColor: hexColor,
        textColor: hexColor,
        welcomeMessage: z.string().trim().min(1, "Welcome message is required").max(300),
        completionMessage: z.string().trim().min(1, "Completion message is required").max(300),
        launcherLabel: z.string().trim().max(40).nullable(),
        position: z.enum(["bottom-right", "bottom-left"]),
        allowedDomains: z
            .array(domain)
            .max(20)
            .transform((list) => [...new Set(list)]),
    })
    .partial()
    .strict();

const updateWidgetSettingsSchema = widgetSettingsSchema.refine(
    (v) => Object.keys(v).length > 0,
    { message: "Nothing to update" },
);

const widgetSettingsValidator = {
    updateWidgetSettingsSchema,
};

export default widgetSettingsValidator;