export type MessageResponse = {
    id: string,
    sessionId: string,
    message: string,
    isQuestion: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export type ImageResponse = {
    id: string,
    name?: string | null,
    url: string,
    prompt: string,
    createdAt: Date,
}