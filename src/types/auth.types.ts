import authValidator from "@/modules/auth/auth.validator";
import * as z from "zod";


export type CreateUserInput = z.infer<typeof authValidator.createUserSchema>;
export type LoginUserInput = z.infer<typeof authValidator.loginUserSchema>;