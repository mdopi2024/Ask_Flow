import catchAsync from "@/utils/shared/catchAsync";
import sendResponse from "@/utils/shared/sendResponse";
import status from "http-status";
import { formServices } from "./form.services";
import { CreateFormInput, UpdateFormInput } from "@/types/form.types";
import { Request, Response } from "express";

const createForm = catchAsync(async (req: Request, res: Response) => {
    const payload: CreateFormInput = req.body;
    const data = await formServices.createForm((req as any).user.id, payload);
    sendResponse(res, status.CREATED, "Form created successfully", data);
});

// const getForms = catchAsync(async (req: Request, res: Response) => {
//     const query = formValidator.listFormsQuerySchema.parse(req.query);
//     const data = await formServices.getForms((req as any).user.id, query);
//     sendResponse(res, status.OK, "Forms fetched successfully", data);
// });

// const getFormStats = catchAsync(async (req: Request, res: Response) => {
//     const data = await formServices.getFormStats((req as any).user.id);
//     sendResponse(res, status.OK, "Form stats fetched successfully", data);
// });

// const getFormById = catchAsync(async (req: Request, res: Response) => {
//     const data = await formServices.getFormById(req.params.id as string, (req as any).user.id);
//     sendResponse(res, status.OK, "Form fetched successfully", data);
// });

// const updateForm = catchAsync(async (req: Request, res: Response) => {
//     const payload: UpdateFormInput = req.body;
//     const data = await formServices.updateForm(req.params.id as string, (req as any).user.id, payload);
//     sendResponse(res, status.OK, "Form updated successfully", data);
// });

// const deleteForm = catchAsync(async (req: Request, res: Response) => {
//     const data = await formServices.deleteForm(req.params.id as string, (req as any).user.id);
//     sendResponse(res, status.OK, "Form deleted successfully", data);
// });

// const publishForm = catchAsync(async (req: Request, res: Response) => {
//     const data = await formServices.publishForm(req.params.id as string, (req as any).user.id);
//     sendResponse(res, status.OK, "Form published successfully", data);
// });

// const unpublishForm = catchAsync(async (req: Request, res: Response) => {
//     const data = await formServices.unpublishForm(req.params.id as string, (req as any).user.id);
//     sendResponse(res, status.OK, "Form unpublished successfully", data);
// });

// const getPublicForm = catchAsync(async (req: Request, res: Response) => {
//     const data = await formServices.getPublicFormBySlug(req.params.slug as string);
//     sendResponse(res, status.OK, "Form fetched successfully", data);
// });

export const formController: Record<string, any> = {
    createForm,
    // getForms,
    // getFormStats,
    // getFormById,
    // updateForm,
    // deleteForm,
    // publishForm,
    // unpublishForm,
    // getPublicForm,
};