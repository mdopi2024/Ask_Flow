import prisma from "@/config/prisma";
import { auth } from "@/lib/auth";
import { AppError } from "@/middleware/appError";
import status from "http-status";
import { CreateUserInput, LoginUserInput } from "@/types/auth.types";
import { fromNodeHeaders } from "better-auth/node";


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
        returnHeaders: true, // gives us the Set-Cookie headers
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