import { prismaClient } from "application/database";
import { HTTPException } from "hono/http-exception";
import { MessageResponse } from "models/ChatModel";
import { SessionMessages } from "models/SessionModel";
import OpenAI from "openai";

export class ChatService {
  static async sendChat(sessionId: string, message: string, engine: string): Promise<string> {

    // send chat to AI
    let openai;
    let aiModel;

    switch (engine) {
      case "gpt":
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        aiModel = "gpt-3.5-turbo";
        break;
      case "deepseek":
        openai = new OpenAI({
          baseURL: 'https://api.deepseek.com',
          apiKey: process.env.DEEPSEEK_API_KEY
        });
        aiModel = "deepseek-chat";
        break;
      default:
        throw new HTTPException(400, {
          message: "Invalid engine, only accept (gpt, deepseek)"
        });
    }

    const response = await openai.chat.completions.create({
      model: aiModel,
      messages: [
        { role: "system", content: "You are a helpful assistant."},
        { role: "user", content: message }
      ],
    });
    const AIResponse = response?.choices[0]?.message?.content || "";

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