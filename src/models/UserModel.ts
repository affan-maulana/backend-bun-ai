export type UserResponse = {
    id: string,
    name: string,
    email?: string | null,
    phone?: string | null, 
    description?: string | null,
    createdAt: Date
}

export type UserRequest = {
    name: string,
    password: string,
    email: string,
    phone?: string | null, 
    description?: string | null,
}
