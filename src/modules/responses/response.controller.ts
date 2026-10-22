import catchAsync from "@/utils/shared/catchAsync";
import sendResponse from "@/utils/shared/sendResponse";
import status from "http-status";
import { Request, Response } from "express";
import { responseServices } from "./response.services";
import responseValidator from "./response.validator";
import { ListResponsesQuery, SubmitResponseInput } from "@/types/response.types";
import { SortOrder } from "@/generated/prisma/internal/prismaNamespace";


const submitResponse = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as SubmitResponseInput;
    const data = await responseServices.submitResponse(req.params.slug as string, payload, {
        userAgent: req.get("user-agent")?.slice(0, 500) ?? null,
        embedOrigin: payload.embedOrigin ?? req.get("origin")?.slice(0, 300) ?? null,
    });

    sendResponse(res, status.CREATED, "Response submitted successfully", data);
});


const getResponsesByFormId = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, sort = "newest" } =
        req.query as unknown as Partial<ListResponsesQuery>;

    const query: ListResponsesQuery = {
        page: Number(page),
        limit: Number(limit),
        sort,
    };

    const data = await responseServices.getResponsesByFormId(
        req.params.formId as string,
        (req as any).user.id,
        query
    );

    sendResponse(res, status.OK, "Responses fetched successfully", data);
});


const getResponseById = catchAsync(async (req: Request, res: Response) => {
    const data = await responseServices.getResponseById(
        req.params.id as string,
        (req as any).user.id
    );

    sendResponse(res, status.OK, "Response fetched successfully", data);
});

const deleteResponse = catchAsync(async (req: Request, res: Response) => {
    const data = await responseServices.deleteResponse(
        req.params.id as string,
        (req as any).user.id
    );

    sendResponse(res, status.OK, "Response deleted successfully", data);
});

export const responseController: Record<string, any> = {
    submitResponse,
    getResponsesByFormId,
    getResponseById,
    deleteResponse,
};