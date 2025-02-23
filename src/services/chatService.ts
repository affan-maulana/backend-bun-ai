import { prismaClient } from "application/database";
import { HTTPException } from "hono/http-exception";
import { MessageResponse } from "models/ChatModel";
import { SessionMessages } from "models/SessionModel";
import OpenAI from "openai";

type ChatCompletionMessageParam = {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
};

export class ChatService {
  static async sendChat(sessionId: string, message: string, history: Array<ChatCompletionMessageParam>): Promise<string> {

    // send chat to GPT
    let AIResponse = 'dummy';
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const aiModel = "gpt-3.5-turbo";

    history.push({ role: "user", content: message });

    const response = await openai.chat.completions.create({
      model: aiModel,
      messages: history,
    });

    AIResponse = response?.choices[0]?.message?.content || "";

    await prismaClient.messages.create({
      data: {
        sessionId: sessionId,
        message: message,
        isQuestion: true,
      },
    });

    // save chat to database
    await prismaClient.messages.create({
      data: {
        sessionId: sessionId,
        message: AIResponse,
        isQuestion: false,
      },
    });


    return AIResponse;
  }

  // getChat
  static async getChat(userId: string, sessionId: string): Promise<SessionMessages> {
    const session = await prismaClient.sessions.findFirst({
      where: {
        id: sessionId,
        userId: userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc"
          }
        },
    }
    });

    if (!session) {
      throw new HTTPException(404, {
        message: "Session not found"
      });
    }

    return session;
  }

}