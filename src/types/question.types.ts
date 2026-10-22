import questionValidator from "@/modules/questions/question.validator";
import * as z from "zod";


export type CreateQuestionInput = z.infer<typeof questionValidator.createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof questionValidator.updateQuestionSchema>;
export type ReorderQuestionsInput = z.infer<typeof questionValidator.reorderQuestionsSchema>;