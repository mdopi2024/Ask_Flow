
import * as z from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Please provide a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginUserSchema = z.object({
    email: z.email("Please provide a valid email address"),
    password: z.string().min(1, "Password is required"),
});

const authValidator = {
    createUserSchema,
    loginUserSchema
}

export default authValidator;