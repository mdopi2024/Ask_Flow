import { z } from "zod";
import { FormStatus } from "@/generated/prisma/enums";

const createFormSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(120),
    description: z.string().trim().max(500).nullable().optional(),
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