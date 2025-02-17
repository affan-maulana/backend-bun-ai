export type MessageResponse = {
    id: string,
    sessionId: string,
    message: string,
    isQuestion: boolean,
    createdAt: Date,
    updatedAt: Date,
}