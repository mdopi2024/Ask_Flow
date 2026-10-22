import { QuestionType } from "@/generated/prisma/enums";

export interface SubmitAnswerInput {
    questionId: string;
    value: string;
}

export interface SubmitResponseInput {
    answers: SubmitAnswerInput[];
    embedOrigin?: string;
}

export interface ListResponsesQuery {
    page: number;
    limit: number;
    sort: "newest" | "oldest";
}

export interface SubmissionMeta {
    userAgent: string | null;
    embedOrigin: string | null;
}


export interface QuestionLike {
    id: string;
    label: string;
    type: QuestionType;
    required: boolean;
    options: string[];
}