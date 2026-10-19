import catchAsync from "@/utils/shared/catchAsync";
import sendResponse from "@/utils/shared/sendResponse";
import status from "http-status";
import { authServices } from "./auth.services";
import { CreateUserInput, LoginUserInput } from "@/types/auth.types";
import { Request, Response } from "express";

const signUpUser = catchAsync(async (req: Request, res: Response) => {
    const payload: CreateUserInput = req.body;
    const data = await authServices.createUser(payload);
    sendResponse(res, status.OK, "User registered successfully", data);
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload: LoginUserInput = req.body;
    const data = await authServices.signInUser(payload);
    sendResponse(res, status.OK, "User logged in successfully", data);
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const data = await authServices.signOutUser(req as any);
    sendResponse(res, status.OK, "User logged out successfully", data);
});

export const authController: Record<string, any> = {
    signUpUser,
    loginUser,
    logoutUser
}
