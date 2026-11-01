import prisma from "@/config/prisma";
import { auth } from "@/lib/auth";
import { AppError } from "@/middleware/appError";
import status from "http-status";
import { CreateUserInput, GetAllUsersQuery, LoginUserInput, UpdateUserRoleInput } from "@/types/auth.types";
import { fromNodeHeaders } from "better-auth/node";
import { IncomingHttpHeaders } from "http";
import { Prisma } from "@/generated/prisma/client";


export const createUser = async (payload: CreateUserInput) => {
    const { name, email, password } = payload;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new AppError(status.CONFLICT, "User with this email already exists");
    }

    const { headers, response } = await auth.api.signUpEmail({
        body: { name, email, password },
        returnHeaders: true,
    });

    return { headers, data: response };
};

export const signInUser = async (payload: LoginUserInput) => {
    const { email, password } = payload;

    const { headers, response } = await auth.api.signInEmail({
        body: { email, password },
        returnHeaders: true,
    });

    return { headers, data: response };
};

export const signOutUser = async (reqHeaders: IncomingHttpHeaders) => {
    const { headers, response } = await auth.api.signOut({
        headers: fromNodeHeaders(reqHeaders),
        returnHeaders: true,
    });

    return { headers, data: response };
};

export const getAllUsers = async (query: GetAllUsersQuery) => {
    const { page, limit, searchTerm, role, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
        ...(role && { role }),
        ...(searchTerm && {
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { email: { contains: searchTerm, mode: "insensitive" } },
            ],
        }),
    };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        }),
        prisma.user.count({ where }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: users,
    };
};

export const updateUserRole = async (
    id: string,
    payload: UpdateUserRoleInput,
    currentUserId: string
) => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    if (user.id === currentUserId) {
        throw new AppError(status.FORBIDDEN, "You cannot change your own role");
    }

    return prisma.user.update({
        where: { id },
        data: { role: payload.role },
        select: { id: true, name: true, email: true, role: true, updatedAt: true },
    });
};

;
export const authServices = {
    createUser,
    signInUser,
    signOutUser,
    getAllUsers,
    updateUserRole,
}