
import formValidator from "@/modules/form/form.validator";
import z from "zod";

export type CreateFormInput = z.infer<typeof formValidator.createFormSchema>;
export type UpdateFormInput = z.infer<typeof formValidator.updateFormSchema>;
export type ListFormsQuery = z.infer<typeof formValidator.listFormsQuerySchema>;