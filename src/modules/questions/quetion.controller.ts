import { Request, Response } from "express";
import status from "http-status";

import catchAsync from "@/utils/shared/catchAsync";
import sendResponse from "@/utils/shared/sendResponse";
import questionServices from "./question.sevices";

const createQuestion = catchAsync(async (req: Request, res: Response) => {
    const formId = req.params.formId as string;
    const data = await questionServices.createQuestion(formId, req.user!.id, req.body);
    sendResponse(res, status.CREATED, "Question created successfully", data);
});

const getQuestionsByFormId = catchAsync(async (req: Request, res: Response) => {
    const formId = req.params.formId as string;
    const data = await questionServices.getQuestionsByFormId(formId, req.user!.id);
    sendResponse(res, status.OK, "Questions fetched successfully", data);
});

// const updateQuestion = catchAsync(async (req: Request, res: Response) => {
//     const formId = req.params.formId as string;
//     const questionId = req.params.questionId as string;
//     const data = await questionServices.updateQuestion(formId, questionId, req.user!.id, req.body);
//     sendResponse(res, status.OK, "Question updated successfully", data);
// });

// const reorderQuestions = catchAsync(async (req: Request, res: Response) => {
//     const formId = req.params.formId as string;
//     const data = await questionServices.reorderQuestions(formId, req.user!.id, req.body.questionIds);
//     sendResponse(res, status.OK, "Questions reordered successfully", data);
// });

// const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
//     const formId = req.params.formId as string;
//     const questionId = req.params.questionId as string;
//     const data = await questionServices.deleteQuestion(formId, questionId, req.user!.id);
//     sendResponse(res, status.OK, "Question deleted successfully", data);
// });

const questionController: any = {
    createQuestion,
    getQuestionsByFormId,
    // updateQuestion,
    // reorderQuestions,
    // deleteQuestion,
};

export default questionController;