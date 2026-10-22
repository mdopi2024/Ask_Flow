import * as z from "zod";
import { QuestionType } from "@/generated/prisma/enums";
import responseValidator from "@/modules/responses/response.validator";


export type SubmitResponseInput = z.infer<typeof responseValidator.submitResponseSchema>;
export type SubmitAnswerInput = SubmitResponseInput["answers"][number];
export type ListResponsesQuery = z.infer<typeof responseValidator.listResponsesQuerySchema>;

export interface SubmissionMeta {
    userAgent: string | null;
    embedOrigin: string | null; // সার্ভার Origin header থেকে বসায়
}

// Service-এ প্রশ্নের সাথে উত্তর মেলাতে
export interface QuestionLike {
    id: string;
    label: string;
    type: QuestionType;
    required: boolean;
    options: string[];
}