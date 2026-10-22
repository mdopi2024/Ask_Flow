import * as z from "zod";

export const createUserSchema = z
    .object({
        name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
        email: z.email("Please provide a valid email address").trim().toLowerCase().max(254),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(72, "Password must be at most 72 characters"),
    })
    .strict();

export const loginUserSchema = z
    .object({
        email: z.email("Please provide a valid email address").trim().toLowerCase(),
        password: z.string().min(1, "Password is required"),
    })
    .strict();

const authValidator = {
    createUserSchema,
    loginUserSchema,
};

export default authValidator;