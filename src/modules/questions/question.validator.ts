import * as z from "zod";
import { QuestionType } from "@/generated/prisma/enums";

const optionsSchema = z
    .array(z.string().trim().min(1, "Option cannot be empty").max(100))
    .max(20, "Maximum 20 options");

const hasDuplicates = (items: string[]) => new Set(items).size !== items.length;

export const createQuestionSchema = z
    .object({
        type: z.enum(QuestionType),
        label: z.string().trim().min(1, "Label is required").max(200),
        placeholder: z.string().trim().max(200).nullable().optional(),
        helpText: z.string().trim().max(500).nullable().optional(),
        required: z.boolean().default(true),
        options: optionsSchema.default([]),
    })
    .refine(
        (data) => data.type !== QuestionType.MULTIPLE_CHOICE || data.options.length >= 2,
        { message: "Multiple choice needs at least 2 options", path: ["options"] }
    )
    .refine(
        (data) => data.type !== QuestionType.MULTIPLE_CHOICE || !hasDuplicates(data.options),
        { message: "Options must be unique", path: ["options"] }
    );

// Cross-field checks against the stored question happen in the service
export const updateQuestionSchema = z
    .object({
        type: z.enum(QuestionType).optional(),
        label: z.string().trim().min(1, "Label is required").max(200).optional(),
        placeholder: z.string().trim().max(200).nullable().optional(),
        helpText: z.string().trim().max(500).nullable().optional(),
        required: z.boolean().optional(),
        options: optionsSchema.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
    });

export const reorderQuestionsSchema = z.object({
    questionIds: z
        .array(z.string().min(1))
        .min(1, "questionIds is required")
        .refine((ids) => !hasDuplicates(ids), { message: "Duplicate question ids" }),
});

const questionValidator = {
    createQuestionSchema,
    updateQuestionSchema,
    reorderQuestionsSchema,
};

export default questionValidator;