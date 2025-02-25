import { Context } from "hono";
import { OpenAI } from "openai";
import "dotenv/config";
import { getUserIdByToken } from "@helpers/tokenHandlers";
import { errorResponse, successResponse } from "@helpers/apiHelpers";
import { SessionService } from "@services/sessionService";
import { AiService } from "@services/aiService";

export const getChat = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const { sessionId } = ctx.req.param();
    await SessionService.checkSessionExist(userId, sessionId);
    const chat = await AiService.getChat(userId, sessionId);

    return successResponse(ctx, chat, "Get Chat Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
};

export const sendChat = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const { sessionId } = ctx.req.param();
    const { 
      message, 
      history = []
    } = await ctx.req.json();

    if (!message) {
      return errorResponse(ctx, 400, "Message is required");
    }
    await SessionService.checkSessionExist(userId, sessionId);
    const responseAI = await AiService.sendChat(sessionId, message, history);

    return successResponse(ctx, responseAI, "Send Chat Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
};

export const generateImage = async (ctx: Context) => {
  try {
    const { prompt } = await ctx.req.json();
    if (!prompt) {
      return errorResponse(ctx, 400, "Prompt is required");
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      model: "dall-e-2"
    });
    
    return successResponse(ctx, response, "Generate Image Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
}
  