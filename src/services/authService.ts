import prisma from "@prismaCli/client";
import { prismaClient } from "application/database";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, toLoginResponse, toRegisterResponse } from "models/AuthModel";
import { AuthValidation } from "validation/AuthValidation";
var secret = process.env.JWT_SECRET || "secret";

export class AuthService {
    static async register(request: RegisterRequest): Promise<RegisterResponse> {
        request = AuthValidation.CREATE.parse(request)
        const check = await prismaClient.users.findFirst({
            where: {
                OR: [{ email: request.email }],
            },
        });

        if (check) {
            throw new HTTPException(400, {
                message: "Email already exists"
            })
        }

        // create hash string for password
        request.password = await Bun.password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10
        })

        const user = await prismaClient.users.create({
            data: {
                name: request.name,
                email: request.email,
                phone: request.phone,
                password: request.password,
                description: request.description,
            },
        });

        return toRegisterResponse(user)
    }

    static async login(request: LoginRequest): Promise<LoginResponse> {
        request = AuthValidation.LOGIN.parse(request);
        const user = await prismaClient.users.findFirst({
            where: {
                email: request.email,
            },
            select: {
                id: true,
                email: true,
                password: true,
            },
        });

        if (!user) {
            throw new HTTPException(404, {
                message: "User not found !"
            })
        }

        const isPasswordValid = await Bun.password.verify(request.password, user.password, 'bcrypt')
        if (!isPasswordValid) {
            throw new HTTPException(401, {
                message: "Username or password is wrong"
            })
        }

        const userPayload = {
            id: user.id,
            email: user.email,
        };

        const payload = {
            sub: userPayload,
            role: "client",
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5, // Token expires in 5 hours
        };
        const token = await sign(payload, secret);

        let dataUser = await prismaClient.users.findFirst({
            where: {
                email: request.email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                description: true,
            },
        });

        const dataReturn = {
            ...dataUser,
            token,
        };

        return toLoginResponse(dataReturn)
    }
}