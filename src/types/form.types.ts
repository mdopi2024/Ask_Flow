import { FormStatus } from "@/generated/prisma/enums";


export interface CreateFormInput {
    title: string;
    description?: string | null;
}



export interface UpdateFormInput {
    title?: string;
    description?: string | null;
    status?: FormStatus;
}

export interface ListFormsQuery {
    page: number;
    limit: number;
    status?: FormStatus;
    search?: string;
    sort: "newest" | "oldest";
}