import { prismaClient } from "application/database";
import { logger } from "application/logging";
import { HTTPException } from "hono/http-exception";
import { ImageResponse } from "models/ChatModel";
import { SessionMessages } from "models/SessionModel";
import OpenAI from "openai";

type ChatCompletionMessageParam = {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
};

export class AiService {
  static async sendChat(
    sessionId: string,
    message: string,
    history: Array<ChatCompletionMessageParam>
  ): Promise<string> {
    // send chat to GPT
    let AIResponse = "dummy";
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
  static async getChat(
    userId: string,
    sessionId: string
  ): Promise<SessionMessages> {
    const session = await prismaClient.sessions.findFirst({
      where: {
        id: sessionId,
        userId: userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!session) {
      throw new HTTPException(404, {
        message: "Session not found",
      });
    }

    return session;
  }

  // generateImage
  static async generateImage(prompt: string, userId:string): Promise<ImageResponse> {
    const countImageGenerated = await prismaClient.images.count({
      where: {
        userId: userId,
      },
    });

    if (countImageGenerated >= 5) {
      throw new HTTPException(400, {
        message: "You have reached the limit of image generation",
      });
      
    }
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      // size: "256x256",
      model: "dall-e-2"
    });

    if (!response?.data[0]) {
      throw new HTTPException(400, {
        message: "Failed to generate image",
      });
    }

    // save response to database
    const url = response?.data[0]?.url || "";

    const newImage = await prismaClient.images.create({
      data: {
        url: url,
        name: "Generated Image " + (countImageGenerated + 1),
        prompt: prompt,
        userId: userId,
      },
    });

    return newImage;
  }

  // getImages
  static async getImages(userId: string): Promise<ImageResponse[]> {
    const images = await prismaClient.images.findMany({
      select: {
        id: true,
        url: true,
        name: true,
        prompt: true,
        createdAt: true,
      },
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return images;
  }

  // getImageById
  static async getImageById(id: string, userId: string): Promise<ImageResponse> {
    const image = await prismaClient.images.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!image) {
      throw new HTTPException(404, {
        message: "Image not found",
      });
    }

    return image;
  }

  // renameImage
  static async renameImage(id: string, userId: string, name: string): Promise<ImageResponse> {
    const image = await prismaClient.images.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!image) {
      throw new HTTPException(404, {
        message: "Image not found",
      });
    }

    await prismaClient.images.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    return image;
  }

  // deleteImage
  static async deleteImage(id: string, userId: string): Promise<void> {
    const image = await prismaClient.images.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!image) {
      throw new HTTPException(404, {
        message: "Image not found",
      });
    }

    await prismaClient.images.delete({
      where: {
        id: id,
      },
    });
  }
}
