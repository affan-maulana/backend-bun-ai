import { Users } from "@prisma/client"

export type RegisterRequest = {
    name: string,
    password: string,
    email: string,
    phone?:string,
    description?: string
}

export type RegisterResponse = {
    id: string,
    name: string,
    email: string,
    phone?:string | null,
    description?: string | null
}

export type LoginRequest = {
    email: string,
    password: string
}

export type LoginResponse = {
    id: string,
    name: string,
    email: string,
    token?:string | null
}

export function toRegisterResponse(reg: Users): RegisterResponse {
    return {
        id: reg.id,
        name: reg.name,
        email: reg.email,
        phone:reg.phone,
        description: reg.description
    };
  }

  export function toLoginResponse(user: Partial<LoginResponse> & { token: string }): LoginResponse {
    return {
        id: user.id!,
        name: user.name!,
        email: user.email!,
        token: user.token,
    };
}