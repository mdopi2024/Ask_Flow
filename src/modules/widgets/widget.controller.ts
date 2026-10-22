import catchAsync from "@/utils/shared/catchAsync";
import { Request, Response } from "express";
import status from "http-status";
import { widgetServices } from "./widget.services";
import sendResponse from "@/utils/shared/sendResponse";


const updateWidgetSettings = catchAsync(async (req: Request, res: Response) => {
    const data = await widgetServices.updateWidgetSettings(
        req.params.formId,
        (req as any).user.id,
        req.body,
    );

    sendResponse(res, status.OK, "Widget settings updated successfully", data);
});

export const widgetControllers: Record<string, any> = {
    updateWidgetSettings,
};