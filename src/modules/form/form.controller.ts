import catchAsync from "@/utils/shared/catchAsync";
import sendResponse from "@/utils/shared/sendResponse";
import status from "http-status";
import { formServices } from "./form.services";
import { CreateFormInput, UpdateFormInput } from "@/types/form.types";
import { Request, Response } from "express";
import formValidator from "./form.validator";
import { FormStatus } from "@/generated/prisma/enums";

const createForm = catchAsync(async (req: Request, res: Response) => {
    const payload: CreateFormInput = req.body;
    const data = await formServices.createForm((req as any).user.id, payload);
    sendResponse(res, status.CREATED, "Form created successfully", data);
});

const getFormsByOwnerId = catchAsync(async (req: Request, res: Response) => {
    const ownerId = (req as any).user.id;

    const rawStatus =
        typeof req.query.status === 'string' && req.query.status.trim() !== ''
            ? req.query.status.trim().toUpperCase()
            : undefined;

    const query = formValidator.listFormsQuerySchema.parse({
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort,
        status: rawStatus,
        search: req.query.search || undefined,
    });

    const data = await formServices.getFormsByOwnerId(ownerId, query);

    sendResponse(res, status.OK, "Forms fetched successfully", data);
});


const getFormById = catchAsync(async (req: Request, res: Response) => {
    const data = await formServices.getFormById(req.params.id as string, (req as any).user.id);
    sendResponse(res, status.OK, "Form fetched successfully", data);
});

const updateForm = catchAsync(async (req: Request, res: Response) => {
    const payload: UpdateFormInput = { ...req.body };

    if (typeof payload.status === 'string') {
        payload.status = (payload.status as string).trim().toUpperCase() as FormStatus;
    }

    const data = await formServices.updateForm(
        req.params.id as string,
        (req as any).user.id,
        payload
    );

    sendResponse(res, status.OK, "Form updated successfully", data);
});

const deleteForm = catchAsync(async (req: Request, res: Response) => {
    const data = await formServices.deleteForm(req.params.id as string, (req as any).user.id);
    sendResponse(res, status.OK, "Form deleted successfully", data);
});

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
    getFormsByOwnerId,
    getFormById,
    updateForm,
    deleteForm,
    // publishForm,
    // unpublishForm,
    // getPublicForm,
};