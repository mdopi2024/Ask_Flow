import catchAsync from "@/utils/shared/catchAsync";
import sendResponse from "@/utils/shared/sendResponse";
import status from "http-status";
import { authServices } from "./auth.services";
import { CreateUserInput, GetAllUsersQuery, LoginUserInput, UpdateUserRoleInput } from "@/types/auth.types";
import { Request, Response } from "express";

const setAuthCookies = (res: Response, headers: Headers) => {
    const cookies = headers.getSetCookie(); // string[]
    if (cookies.length) {
        res.setHeader("Set-Cookie", cookies);
    }
};

const signUpUser = catchAsync(async (req: Request, res: Response) => {
    const payload: CreateUserInput = req.body;
    const { headers, data } = await authServices.createUser(payload);

    setAuthCookies(res, headers);
    sendResponse(res, status.OK, "User registered successfully", data);
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload: LoginUserInput = req.body;
    const { headers, data } = await authServices.signInUser(payload);
    setAuthCookies(res, headers);
    sendResponse(res, status.OK, "User logged in successfully", data);
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const { headers, data } = await authServices.signOutUser(req.headers);

    setAuthCookies(res, headers);
    sendResponse(res, status.OK, "User logged out successfully", data);
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const {
        page = 1,
        limit = 10,
        searchTerm,
        role,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = req.query as unknown as Partial<GetAllUsersQuery>;

    const { meta, data } = await authServices.getAllUsers({
        page: Number(page),
        limit: Number(limit),
        searchTerm,
        role,
        sortBy,
        sortOrder,
    });

    sendResponse(res, status.OK, "Users retrieved successfully", { meta, data });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const payload: UpdateUserRoleInput = req.body;
    const currentUserId = req.user!.id;

    const data = await authServices.updateUserRole(id, payload, currentUserId);

    sendResponse(res, status.OK, "User role updated successfully", data);
});
export const authController: Record<string, any> = {
    signUpUser,
    loginUser,
    logoutUser,
    getAllUsers,
    updateUserRole

}
