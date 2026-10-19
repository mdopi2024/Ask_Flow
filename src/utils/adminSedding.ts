import prisma from "@/config/prisma";
import { auth } from "@/lib/auth";
import { Role } from "@/generated/prisma/enums";
import { env } from "@/config/env";
import { AppError } from "@/middleware/appError";
import status from "http-status";
export const seedAdmin = async () => {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = env;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
        });

        if (existingUser) {
            if (existingUser.role === Role.ADMIN && !existingUser.isDeleted) {
                if (env.isDev()) console.log("✅ Admin already exists, skipping seed");
                return;
            }

            await prisma.user.update({
                where: { email: ADMIN_EMAIL },
                data: { role: Role.ADMIN, isDeleted: false, emailVerified: true },
            });

            if (env.isDev()) console.log("✅ Existing user promoted to ADMIN:", ADMIN_EMAIL);
            return;
        }

        await auth.api.signUpEmail({
            body: {
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
            },
        });

        await prisma.user.update({
            where: { email: ADMIN_EMAIL },
            data: { role: Role.ADMIN, emailVerified: true },
        });

        if (env.isDev()) console.log("✅ Admin seeded successfully:", ADMIN_EMAIL);
    } catch (error) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to seed admin");
    }
};

seedAdmin()