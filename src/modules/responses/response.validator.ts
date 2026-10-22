import { z } from "zod";

const submitResponseSchema = z.object({
    answers: z
        .array(
            z.object({
                questionId: z.string().trim().min(1, "questionId is required"),
                value: z.string().trim().max(5000, "Answer is too long"),
            })
        )
        .min(1, "At least one answer is required")
        .max(100),
    embedOrigin: z.string().trim().max(500).optional(),
});

const listResponsesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(["newest", "oldest"]).default("newest"),
});

export const emailSchema = z.string().email();

const responseValidator = {
    submitResponseSchema,
    listResponsesQuerySchema,
};

export default responseValidator;