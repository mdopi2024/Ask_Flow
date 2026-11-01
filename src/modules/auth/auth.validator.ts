import * as z from "zod";
const roleEnum = z.enum(["USER", "ADMIN"]);


export const createUserSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
    email: z.email("Please provide a valid email address").trim().toLowerCase().max(254),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must be at most 72 characters"),
})
    .strict();

export const loginUserSchema = z.object({
    email: z.email("Please provide a valid email address").trim().toLowerCase(),
    password: z.string().min(1, "Password is required"),
})
    .strict();




const getAllUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    searchTerm: z.string().trim().min(1).optional(),
    role: roleEnum.optional(),
    sortBy: z.enum(["createdAt", "name", "email", "role"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const updateUserRoleSchema = z.object({
    role: roleEnum,
});

const userIdParamSchema = z.object({
    id: z.string().min(1, "User id is required"),
});





const authValidator = {
    createUserSchema,
    loginUserSchema,
    getAllUsersQuerySchema,
    updateUserRoleSchema,
    userIdParamSchema
};



export default authValidator;