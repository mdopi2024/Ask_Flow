import prisma from "@/config/prisma";
import { AppError } from "@/middleware/appError";
import status from "http-status";

import { FormStatus, QuestionType } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import {
    ListResponsesQuery,
    QuestionLike,
    SubmissionMeta,
    SubmitResponseInput,
} from "@/types/response.types";
import { emailSchema } from "./response.validator";

//--------------------------------------------------

const assertOwnsForm = async (formId: string, ownerId: string) => {
    const form = await prisma.form.findFirst({
        where: { id: formId, ownerId },
        select: { id: true, title: true },
    });

    if (!form) {
        throw new AppError(status.NOT_FOUND, "Form not found");
    }

    return form;
};


const validateValue = (question: QuestionLike, rawValue: string): string => {
    const value = rawValue.trim();
    const fail = (msg: string): never => {
        throw new AppError(status.BAD_REQUEST, `"${question.label}": ${msg}`);
    };

    switch (question.type) {
        case QuestionType.EMAIL:
            if (!emailSchema.safeParse(value).success) fail("Invalid email address");
            return value.toLowerCase();

        case QuestionType.YES_NO: {
            const v = value.toLowerCase();
            if (v !== "yes" && v !== "no") fail("Answer must be yes or no");
            return v;
        }

        case QuestionType.MULTIPLE_CHOICE:
            if (!question.options.includes(value)) fail("Invalid option selected");
            return value;

        case QuestionType.TEXT:
        default:
            return value;
    }
};

//--------------------------------------------


export const submitResponse = async (
    slug: string,
    payload: SubmitResponseInput,
    meta: SubmissionMeta
) => {
    const form = await prisma.form.findFirst({
        where: { slug, status: FormStatus.PUBLISHED },
        select: {
            id: true,
            questions: {
                orderBy: { order: "asc" },
                select: { id: true, label: true, type: true, required: true, options: true },
            },
        },
    });

    if (!form) {
        throw new AppError(status.NOT_FOUND, "Form not found or not published");
    }

    const questionMap = new Map(form.questions.map((q) => [q.id, q]));
    const submitted = new Map<string, string>();

    for (const a of payload.answers) {
        if (!questionMap.has(a.questionId)) {
            throw new AppError(status.BAD_REQUEST, `Unknown question: ${a.questionId}`);
        }
        if (submitted.has(a.questionId)) {
            throw new AppError(status.BAD_REQUEST, "Duplicate answers for the same question");
        }
        submitted.set(a.questionId, a.value);
    }

    const answersData: Prisma.AnswerCreateWithoutResponseInput[] = [];
    let respondentEmail: string | null = null;

    for (const question of form.questions) {
        const raw = submitted.get(question.id) ?? "";

        if (raw.trim() === "") {
            if (question.required) {
                throw new AppError(status.BAD_REQUEST, `"${question.label}" is required`);
            }
            continue;
        }

        const value = validateValue(question, raw);

        if (question.type === QuestionType.EMAIL && !respondentEmail) {
            respondentEmail = value;
        }

        answersData.push({
            question: { connect: { id: question.id } },
            questionLabel: question.label,
            questionType: question.type,
            value,
        });
    }

    await prisma.response.create({
        data: {
            form: { connect: { id: form.id } },
            respondentEmail,
            embedOrigin: meta.embedOrigin,
            userAgent: meta.userAgent,
            answers: { create: answersData },
        },
        select: { id: true },
    });

    return { submitted: true };
};

export const getResponsesByFormId = async (
    formId: string,
    ownerId: string,
    query: ListResponsesQuery
) => {
    const form = await assertOwnsForm(formId, ownerId);

    const { page, limit, sort } = query;
    const where: Prisma.ResponseWhereInput = { formId };

    const [items, total] = await Promise.all([
        prisma.response.findMany({
            where,
            orderBy: { submittedAt: sort === "newest" ? "desc" : "asc" },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                answers: { orderBy: { createdAt: "asc" } },
            },
        }),
        prisma.response.count({ where }),
    ]);

    return {
        form,
        items,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};


export const getResponseById = async (id: string, ownerId: string) => {
    const data = await prisma.response.findFirst({
        where: { id, form: { ownerId } },
        include: {
            answers: { orderBy: { createdAt: "asc" } },
            form: { select: { id: true, title: true } },
        },
    });

    if (!data) {
        throw new AppError(status.NOT_FOUND, "Response not found");
    }

    return data;
};

export const deleteResponse = async (id: string, ownerId: string) => {
    await getResponseById(id, ownerId);

    await prisma.response.delete({ where: { id } });

    return null;
};

export const responseServices = {
    submitResponse,
    getResponsesByFormId,
    getResponseById,
    deleteResponse,
};