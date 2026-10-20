import prisma from "@/config/prisma";
import { AppError } from "@/middleware/appError";
import status from "http-status";
import { randomBytes } from "crypto";

import { FormStatus } from "@/generated/prisma/enums";
import { CreateFormInput, ListFormsQuery, UpdateFormInput } from "@/types/form.types";
import { Prisma } from "@/generated/prisma/client";

//--------------------------------------------------

const generateSlug = (title: string): string => {
    const base =
        title
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 40) || "form";
    return `${base}-${randomBytes(4).toString("hex")}`;
};

const getOwnedForm = async (id: string, ownerId: string) => {
    const form = await prisma.form.findFirst({ where: { id, ownerId } });

    if (!form) {
        throw new AppError(status.NOT_FOUND, "Form not found");
    }

    return form;
};

//--------------------------------------------

export const createForm = async (ownerId: string, payload: CreateFormInput) => {
    const { title, description } = payload;

    const data = await prisma.form.create({
        data: {
            title,
            description: description ?? null,
            slug: generateSlug(title),
            ownerId,
        },
    });

    return data;
};

export const getFormsByOwnerId = async (ownerId: string, query: ListFormsQuery) => {
    const { page, limit, status, search, sort } = query;

    const where: Prisma.FormWhereInput = { ownerId };

    if (status) where.status = status;

    if (search) {
        where.title = { contains: search, mode: "insensitive" };
    }

    const orderBy: Prisma.FormOrderByWithRelationInput = {
        createdAt: sort === "newest" ? "desc" : "asc",
    };

    const [items, total, statusGroups, totalResponses] = await Promise.all([
        prisma.form.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                _count: { select: { questions: true, responses: true } },
            },
        }),

        prisma.form.count({ where }),

        prisma.form.groupBy({
            by: ["status"],
            where: { ownerId },
            _count: { _all: true },
        }),

        prisma.response.count({ where: { form: { ownerId } } }),
    ]);

    const countOf = (s: FormStatus) =>
        statusGroups.find((g) => g.status === s)?._count._all ?? 0;

    const publishedForms = countOf(FormStatus.PUBLISHED);
    const draftForms = countOf(FormStatus.DRAFT);
    const unpublishedForms = countOf(FormStatus.UNPUBLISHED);

    return {
        items,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        stats: {
            totalForms: publishedForms + draftForms + unpublishedForms,
            publishedForms,
            draftForms,
            unpublishedForms,
            totalResponses,
        },
    };
};

export const getFormById = async (id: string, ownerId: string) => {
    const data = await prisma.form.findFirst({
        where: { id, ownerId },
        include: {
            questions: { orderBy: { order: "asc" } },
            widgetSettings: true,
            _count: { select: { responses: true } },
        },
    });
    if (!data) {
        throw new AppError(status.NOT_FOUND, "Form not found");
    }
    return data;
};



export const updateForm = async (id: string, ownerId: string, payload: UpdateFormInput) => {
    await getOwnedForm(id, ownerId);

    const data = await prisma.form.update({
        where: { id },
        data: payload,
    });

    return data;
};

// export const deleteForm = async (id: string, ownerId: string) => {
//     await getOwnedForm(id, ownerId);

//     await prisma.form.delete({ where: { id } });

//     return null;
// };

// export const publishForm = async (id: string, ownerId: string) => {
//     const form = await getOwnedForm(id, ownerId);

//     if (form.status === FormStatus.PUBLISHED) {
//         return form;
//     }

//     const questionCount = await prisma.question.count({ where: { formId: id } });

//     if (questionCount === 0) {
//         throw new AppError(status.BAD_REQUEST, "Add at least one question before publishing");
//     }

//     const data = await prisma.form.update({
//         where: { id },
//         data: { status: FormStatus.PUBLISHED, publishedAt: new Date() },
//     });

//     return data;
// };

// export const unpublishForm = async (id: string, ownerId: string) => {
//     await getOwnedForm(id, ownerId);

//     const data = await prisma.form.update({
//         where: { id },
//         data: { status: FormStatus.DRAFT },
//     });

//     return data;
// };

// export const getPublicFormBySlug = async (slug: string) => {
//     const data = await prisma.form.findFirst({
//         where: { slug, status: FormStatus.PUBLISHED },
//         select: {
//             id: true,
//             title: true,
//             description: true,
//             slug: true,
//             widgetSettings: true,
//             questions: { orderBy: { order: "asc" } },
//         },
//     });

//     if (!data) {
//         throw new AppError(status.NOT_FOUND, "Form not found or not published");
//     }

//     return data;
// };

export const formServices = {
    createForm,
    getFormsByOwnerId,
    getFormById,
    updateForm,
    // deleteForm,
    // publishForm,
    // unpublishForm,
    // getPublicFormBySlug,
};