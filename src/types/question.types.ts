import { QuestionType } from "@/generated/prisma/enums";


export interface CreateQuestionInput {
    type: QuestionType;
    label: string;
    placeholder?: string | null;
    helpText?: string | null;
    required: boolean;
    options: string[];
}



export interface UpdateQuestionInput {
    type?: QuestionType;
    label?: string;
    placeholder?: string | null;
    helpText?: string | null;
    required?: boolean;
    options?: string[];
}

export interface ReorderQuestionsInput {
    questionIds: string[];
}