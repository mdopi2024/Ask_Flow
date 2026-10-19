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



const formValidator = {
    createFormSchema,
    updateFormSchema,
};

export default formValidator;