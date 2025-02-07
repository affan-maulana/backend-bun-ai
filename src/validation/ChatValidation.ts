import {z, ZodType} from "zod";

export class ChatValidation {

    static readonly CreateMessageHistorySchema: ZodType = z.object({
        build_id: z.string().uuid({ message: "Invalid build_id format, must be UUID" }),
        historyId: z.string().optional().or(z.literal("")),
        is_question: z.boolean(),
        knowledge_id: z.string().uuid({ message: "Invalid knowledge_id format, must be UUID" }),
        level: z.string().optional(),
        message: z.string().min(1, { message: "Message cannot be empty" }),
        sessionId: z.string().uuid({ message: "Invalid sessionId format, must be UUID" })
    })
}
