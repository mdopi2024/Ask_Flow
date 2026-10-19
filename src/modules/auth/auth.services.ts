import prisma from "@/config/prisma";
import { auth } from "@/lib/auth";
import { AppError } from "@/middleware/appError";
import status from "http-status";
import { CreateUserInput, LoginUserInput } from "@/types/auth.types";
import { fromNodeHeaders } from "better-auth/node";


export const createUser = async (payload: CreateUserInput) => {
    const { name, email, password } = payload;
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new AppError(status.CONFLICT, "User with this email already exists");
    }

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        },
    });

    return data;
};

export const signInUser = async (payload: LoginUserInput) => {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
    });

    return data;
};

export const signOutUser = async (req: Request) => {
    const data = await auth.api.signOut({
        headers: fromNodeHeaders(req.headers as any),
    });

    return data;
};

export const authServices = {
    createUser,
    signInUser,
    signOutUser
}