import * as z from "zod";

const answerSchema = z
    .object({
        questionId: z.string().trim().min(1, "questionId is required"),
        value: z.string().trim().max(5000, "Answer is too long"),
    })
    .strict();

const submitResponseSchema = z
    .object({
        answers: z
            .array(answerSchema)
            .min(1, "At least one answer is required")
            .max(100)
            .refine(
                (list) => new Set(list.map((a) => a.questionId)).size === list.length,
                { message: "Duplicate answers for the same question" },
            ),
    })
    .strict();

const listResponsesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(["newest", "oldest"]).default("newest"),
});

export const emailSchema = z.email().trim().toLowerCase();

const responseValidator = {
    submitResponseSchema,
    listResponsesQuerySchema,
    emailSchema,
};

export default responseValidator;