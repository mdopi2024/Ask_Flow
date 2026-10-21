import status from "http-status";

import prisma from "@/config/prisma";
import { AppError } from "@/middleware/appError";
import { QuestionType } from "@/generated/prisma/enums";
import { CreateQuestionInput, UpdateQuestionInput } from "@/types/question.types";


// ---------- helpers ----------

const hasDuplicates = (items: string[]) => new Set(items).size !== items.length;

// Only multiple choice keeps options, every other type stores []
const normalizeOptions = (type: QuestionType, options: string[]) => {
    return type === QuestionType.MULTIPLE_CHOICE ? options : [];
};

const assertFormOwner = async (formId: string, ownerId: string) => {
    const form = await prisma.form.findFirst({
        where: { id: formId, ownerId },
        select: { id: true },
    });

    if (!form) {
        throw new AppError(status.NOT_FOUND, "Form not found");
    }
};

const findQuestionOrThrow = async (formId: string, questionId: string) => {
    const question = await prisma.question.findFirst({
        where: { id: questionId, formId },
    });

    if (!question) {
        throw new AppError(status.NOT_FOUND, "Question not found");
    }

    return question;
};

const assertValidChoiceOptions = (type: QuestionType, options: string[]) => {
    if (type !== QuestionType.MULTIPLE_CHOICE) return;

    if (options.length < 2) {
        throw new AppError(status.BAD_REQUEST, "Multiple choice needs at least 2 options");
    }

    if (hasDuplicates(options)) {
        throw new AppError(status.BAD_REQUEST, "Options must be unique");
    }
};

// ---------- services ----------

export const createQuestion = async (
    formId: string,
    ownerId: string,
    payload: CreateQuestionInput
) => {
    await assertFormOwner(formId, ownerId);

    const lastQuestion = await prisma.question.findFirst({
        where: { formId },
        orderBy: { order: "desc" },
        select: { order: true },
    });

    const nextOrder = lastQuestion ? lastQuestion.order + 1 : 0;

    return prisma.question.create({
        data: {
            ...payload,
            options: normalizeOptions(payload.type, payload.options),
            formId,
            order: nextOrder,
        },
    });
};

export const getQuestionsByFormId = async (formId: string, ownerId: string) => {
    await assertFormOwner(formId, ownerId);

    return prisma.question.findMany({
        where: { formId },
        orderBy: { order: "asc" },
    });
};

export const updateQuestion = async (
    formId: string,
    questionId: string,
    ownerId: string,
    payload: UpdateQuestionInput
) => {
    await assertFormOwner(formId, ownerId);
    const existing = await findQuestionOrThrow(formId, questionId);

    // Validate the final state: stored values + the changes
    const type = payload.type ?? existing.type;
    const options = payload.options ?? existing.options;

    assertValidChoiceOptions(type, options);
    return prisma.question.update({
        where: { id: questionId },
        data: payload,
    });
};

export const reorderQuestions = async (
    formId: string,
    ownerId: string,
    questionIds: string[]
) => {
    await assertFormOwner(formId, ownerId);

    const questions = await prisma.question.findMany({
        where: { formId },
        select: { id: true },
    });

    const existingIds = new Set(questions.map((question) => question.id));
    const coversAllQuestions =
        existingIds.size === questionIds.length &&
        questionIds.every((id) => existingIds.has(id));

    if (!coversAllQuestions) {
        throw new AppError(
            status.BAD_REQUEST,
            "questionIds must contain every question of this form exactly once"
        );
    }

    await prisma.$transaction(
        questionIds.map((id, index) =>
            prisma.question.update({ where: { id }, data: { order: index } })
        )
    );

    return getQuestionsByFormId(formId, ownerId);
};

export const deleteQuestion = async (
    formId: string,
    questionId: string,
    ownerId: string
) => {
    await assertFormOwner(formId, ownerId);
    await findQuestionOrThrow(formId, questionId);

    await prisma.$transaction(async (tx) => {
        await tx.question.delete({ where: { id: questionId } });

        // Close the gap so order stays 0..n-1
        const remaining = await tx.question.findMany({
            where: { formId },
            orderBy: { order: "asc" },
            select: { id: true },
        });

        for (const [index, question] of remaining.entries()) {
            await tx.question.update({
                where: { id: question.id },
                data: { order: index },
            });
        }
    });

    return null;
};

const questionServices = {
    createQuestion,
    getQuestionsByFormId,
    updateQuestion,
    reorderQuestions,
    deleteQuestion,
};

export default questionServices;