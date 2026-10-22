import { FormStatus } from "@/generated/prisma/enums";
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
        botName: z.string().trim().min(1).max(50),
        primaryColor: hexColor,
        backgroundColor: hexColor,
        textColor: hexColor,
        welcomeMessage: z.string().trim().min(1).max(300),
        completionMessage: z.string().trim().min(1).max(300),
        launcherLabel: z.string().trim().max(40).nullable(),
        position: z.enum(["bottom-right", "bottom-left"]),
        allowedDomains: z.array(domain).max(20),
    })
    .partial(); // সব field optional, না দিলে DB default বসবে

export const createFormSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(120),
    description: z.string().trim().max(500).nullable().optional(),
    widgetSettings: widgetSettingsSchema.optional(),
});

const updateFormSchema = z.object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(500).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});



export const listFormsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(FormStatus).optional(), // DRAFT | PUBLISHED | UNPUBLISHED
    search: z.string().trim().min(1).optional(),
    sort: z.enum(["newest", "oldest"]).default("newest"),
});






const formValidator = {
    createFormSchema,
    updateFormSchema,
    listFormsQuerySchema,
};

export default formValidator;