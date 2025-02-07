import { z, ZodType } from "zod";

export class AuthValidation {

    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1, "Name is required"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        email: z.string().email("Invalid email format"),
        phone: z.string().optional(),
        description: z.string().optional()
    })

    static readonly LOGIN: ZodType = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string(),
    })

    static readonly LOGIN_SSO: ZodType = z.object({
        id: z.string().uuid("Invalid ID format, must be a valid UUID"),
        email: z.string().email("Invalid email format"),
        password: z.string(),
    })
}
