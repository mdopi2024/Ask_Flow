import { FormStatus } from "@/generated/prisma/enums";
import { createFormSchema, widgetSettingsSchema } from "@/modules/form/form.validator";
import z from "zod";

export type WidgetSettingsInput = z.infer<typeof widgetSettingsSchema>;
export type CreateFormInput = z.infer<typeof createFormSchema>;



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