import prisma from "@/config/prisma";
import { AppError } from "@/middleware/appError";
import { WidgetSettingsInput } from "@/types/form.types";
import status from "http-status";

const updateWidgetSettings = async (
    formId: string,
    ownerId: string,
    payload: WidgetSettingsInput,
) => {
    const form = await prisma.form.findFirst({
        where: { id: formId, ownerId },
        select: { id: true },
    });

    if (!form) {
        throw new AppError(status.NOT_FOUND, "Form not found");
    }

    return prisma.widgetSettings.upsert({
        where: { formId },
        create: { formId, ...payload },
        update: payload,
    });
};

export const widgetServices = {
    updateWidgetSettings,
};