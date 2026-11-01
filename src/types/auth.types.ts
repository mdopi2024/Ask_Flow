import authValidator from "@/modules/auth/auth.validator";
import * as z from "zod";


export type CreateUserInput = z.infer<typeof authValidator.createUserSchema>;
export type LoginUserInput = z.infer<typeof authValidator.loginUserSchema>;

export type GetAllUsersQuery = z.infer<typeof authValidator.getAllUsersQuerySchema>;
export type UpdateUserRoleInput = z.infer<typeof authValidator.updateUserRoleSchema>;