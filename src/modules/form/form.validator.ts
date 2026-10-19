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

const listFormsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    status: z.nativeEnum(FormStatus).optional(),
    search: z.string().trim().max(100).optional(),
    sort: z.enum(["newest", "oldest"]).default("newest"),
});


const formValidator = {
    createFormSchema,
    updateFormSchema,
    listFormsQuerySchema,
};

export default formValidator;