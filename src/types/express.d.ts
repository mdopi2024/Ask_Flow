


export interface AuthUser {
    id: string;
    name: string;
    email: string;
    isDeleted: boolean;
    role: Role;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser; // optional auth এর জন্য ? রাখা হয়েছে
        }
    }
}